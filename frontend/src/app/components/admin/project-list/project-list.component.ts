import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { TicketService } from '../../../services/ticket.service';
import { Projet } from '../../../models/projet.model';
@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
    private readonly projectService = inject(ProjectService);
    private readonly ticketService = inject(TicketService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    projets: any[] = [];
    ngOnInit(): void {
        this.loadProjets();
    }
    loadProjets(): void {
        this.projectService.obtenirTousLesProjets().subscribe({
            next: (data: any) => {
                this.projets = data;
                this.loadTicketCounts();
                this.cdr.detectChanges();
            },
            error: () => {
                this.cdr.detectChanges();
            }
        });
    }
    loadTicketCounts(): void {
        this.ticketService.obtenirTousLesTickets().subscribe({
            next: (tickets: any[]) => {
                this.projets = (this.projets as any[]).map((p: any) => ({
                    ...p,
                    tickets: tickets.filter((t: any) => t.projet?.id === p.id)
                }));
                this.cdr.detectChanges();
            },
            error: () => { }
        });
    }
    deleteProject(id: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            this.projectService.supprimerProjet(id).subscribe({
                next: () => {
                    this.loadProjets();
                },
                error: () => { }
            });
        }
    }
}

