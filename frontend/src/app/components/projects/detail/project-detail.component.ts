import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { TicketService } from '../../../services/ticket.service';
import { Projet } from '../../../models/projet.model';
import { Ticket } from '../../../models/ticket.model';
import { forkJoin } from 'rxjs';
@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly projectService = inject(ProjectService);
    private readonly router = inject(Router);
    private readonly ticketService = inject(TicketService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);
    project: any = null;
    tickets: any[] = [];
    stats = {
        total: 0,
        ouvert: 0,
        enCours: 0,
        resolu: 0,
        ferme: 0
    };
    isLoading = true;
    errorMessage: string = '';
    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadProject(+id);
        }
    }
    loadProject(id: number): void {
        forkJoin({
            project: this.projectService.obtenirProjetParId(id),
            tickets: this.ticketService.obtenirTicketsParProjet(id)
        }).subscribe({
            next: (result: any) => {
                this.project = result.project;
                this.tickets = result.tickets || [];
                this.calculateStats();
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.ngZone.run(() => {
                    this.errorMessage = "Impossible de charger les données du projet";
                    this.isLoading = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }
    calculateStats(): void {
        this.stats = {
            total: this.tickets.length,
            ouvert: (this.tickets as any[]).filter((t: any) => t.statut === 'OUVERT').length,
            enCours: (this.tickets as any[]).filter((t: any) => t.statut === 'EN_COURS').length,
            resolu: (this.tickets as any[]).filter((t: any) => t.statut === 'RESOLU').length,
            ferme: (this.tickets as any[]).filter((t: any) => t.statut === 'FERME').length
        };
    }

    formatStatus(statut: string): string {
        const statusMap: { [key: string]: string } = {
            'EN_COURS': 'En cours',
            'OUVERT': 'Ouvert',
            'RESOLU': 'Résolu',
            'FERME': 'Fermé',
            'ACTIF': 'Actif',
            'TERMINE': 'Terminé',
            'SUSPENDU': 'Suspendu'
        };
        return statusMap[statut] || statut;
    }

    getStatusClass(statut: string): string {
        const classMap: { [key: string]: string } = {
            'EN_COURS': 'en-cours',
            'OUVERT': 'ouvert',
            'RESOLU': 'resolu',
            'FERME': 'ferme',
            'ACTIF': 'actif',
            'TERMINE': 'termine',
            'SUSPENDU': 'suspendu'
        };
        return classMap[statut] || statut.toLowerCase();
    }
}

