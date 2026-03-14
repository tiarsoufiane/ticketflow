import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../services/ticket.service';
import { ProjectService } from '../../../services/project.service';
import { AuthService } from '../../../services/auth.service';
import { PieceJointeService } from '../../../services/piece-jointe.service';
import { Projet } from '../../../models/projet.model';
@Component({
    selector: 'app-ticket-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './ticket-create.component.html',
    styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {
    private readonly ticketService = inject(TicketService);
    private readonly projectService = inject(ProjectService);
    private readonly authService = inject(AuthService);
    private readonly pieceJointeService = inject(PieceJointeService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);
    form: any = {
        titre: null,
        description: null,
        priorite: 'MOYENNE',
        projetId: null
    };
    projets: Projet[] = [];
    selectedFiles: any[] = [];
    errorMessage = '';
    loading = true;
    ngOnInit(): void {
        const user = this.authService.getUser();
        this.route.queryParams.subscribe((params: any) => {
            if (params['projetId']) {
                this.form.projetId = +params['projetId'];
            }
        });
        if (user && user.id) {
            this.projectService.obtenirProjetsParClient(user.id).subscribe({
                next: (data: any[]) => {
                    this.projets = data;
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }
    onFileSelected(event: any): void {
        const files: FileList = event.target.files;
        if (files.length > 5) {
            this.errorMessage = "Maximum 5 fichiers autorisés";
            return;
        }
        this.selectedFiles = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 2 * 1024 * 1024) {
                this.errorMessage = `Le fichier "${file.name}" dépasse la taille maximale de 2 MB`;
                this.selectedFiles = [];
                return;
            }
            this.selectedFiles.push(file);
        }
        this.errorMessage = '';
    }
    removeFile(index: number): void {
        this.selectedFiles.splice(index, 1);
    }
    onSubmit(): void {
        if (!this.form.titre || !this.form.description || !this.form.projetId) {
            this.errorMessage = "Veuillez remplir tous les champs requis";
            return;
        }
        this.ticketService.creerTicket(this.form).subscribe({
            next: (response: any) => {
                if (this.selectedFiles.length > 0) {
                    this.pieceJointeService.televerserFichiers(response.ticketId, this.selectedFiles).subscribe({
                        next: (attachments: any) => {
                            this.router.navigate(['/tickets']);
                        },
                        error: (err: any) => {
                            this.errorMessage = "Le ticket a été créé mais l'envoi des fichiers a échoué. Veuillez réessayer ou contacter le support.";
                            this.loading = false;
                        }
                    });
                } else {
                    this.router.navigate(['/tickets']);
                }
            },
            error: (err) => {
                this.errorMessage = err.error?.message || err.error?.error || err.error || "Erreur lors de la création du ticket";
            }
        });
    }
}

