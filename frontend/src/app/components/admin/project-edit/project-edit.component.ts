import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { DemandeCreationProjet } from '../../../models/request.model';
@Component({
    selector: 'app-project-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './project-edit.component.html',
    styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly projectService = inject(ProjectService);
    private readonly adminService = inject(AdminService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    form: DemandeCreationProjet = {
        nom: '',
        description: '',
        dateDebut: '',
        dateLivraison: '',
        clientId: 0
    };
    projectId!: number;
    clients: User[] = [];
    isSuccessful = false;
    isLoadingProject = true;
    errorMessage = '';
    get dateError(): boolean {
        if (!this.form.dateDebut || !this.form.dateLivraison) return false;
        return new (window as any).Date(this.form.dateLivraison) < new (window as any).Date(this.form.dateDebut);
    }
    ngOnInit(): void {
        this.projectId = (window as any).Number(this.route.snapshot.paramMap.get('id'));
        this.loadClients();
        if (this.projectId) {
            this.loadProject();
        }
    }
    loadClients(): void {
        this.adminService.obtenirClients().subscribe({
            next: (data: any) => {
                this.clients = data;
                this.cdr.detectChanges();
            }
        });
    }
    loadProject(): void {
        this.projectService.obtenirProjetParId(this.projectId).subscribe({
            next: (project: any) => {
                this.ngZone.run(() => {
                    this.form = {
                        nom: project.nom,
                        description: project.description,
                        dateDebut: project.dateDebut,
                        dateLivraison: project.dateLivraison,
                        clientId: project.client?.id || 0
                    };
                    this.isLoadingProject = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err: any) => {
                this.ngZone.run(() => {
                    this.errorMessage = "Impossible de charger les données du projet";
                    this.isLoadingProject = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }
    onSubmit(): void {
        this.projectService.modifierProjet(this.projectId, this.form).subscribe({
            next: (res: any) => {
                this.ngZone.run(() => {
                    this.isSuccessful = true;
                    this.cdr.detectChanges();
                    setTimeout(() => this.ngZone.run(() => this.router.navigate(['/admin/projects'])), 1500);
                });
            },
            error: (err: any) => {
                this.ngZone.run(() => {
                    this.errorMessage = err.error?.message || "Erreur lors de la mise à jour";
                    this.cdr.detectChanges();
                });
            }
        });
    }
}

