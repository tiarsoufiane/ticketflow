import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../../models/ticket.model';
import { User } from '../../../models/user.model';
import { ProjectService } from '../../../services/project.service';
import { Projet } from '../../../models/projet.model';
@Component({
    selector: 'app-ticket-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
    private readonly ticketService = inject(TicketService);
    private readonly authService = inject(AuthService);
    private readonly adminService = inject(AdminService);
    private readonly projectService = inject(ProjectService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);
    private readonly route = inject(ActivatedRoute);
    tickets: Ticket[] = [];
    filteredTickets: Ticket[] = [];
    techniciens: User[] = [];
    projects: Projet[] = [];
    role: string = '';
    userId: number = 0;
    filters = {
        statut: 'TOUS',
        projetId: 0,
        search: ''
    };
    editingTicketId: number | null = null;
    editTechnicienId: number | null = null;
    editStatus: string | null = null;
    ngOnInit(): void {
        const user = this.authService.getUser();
        if (user) {
            this.role = user.role;
            this.userId = user.id;
            this.loadTickets();
            if (this.role === 'ADMIN') {
                this.loadTechniciens();
            }
            if (this.role === 'CLIENT') {
                this.loadProjects();
            }
        }
    }
    loadTickets(): void {
        const currentPath = this.route.snapshot.routeConfig?.path || '';
        const handleData = (data: Ticket[]) => {
            if (currentPath === 'tickets/all') {
                this.tickets = Array.isArray(data) ? data.sort((a: any, b: any) =>
                    new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()) : [];
            } else {
                this.tickets = data;
            }
            this.applyFilters();
            this.cdr.detectChanges();
        };
        if (currentPath === 'tickets/all') {
            this.ticketService.obtenirTousLesTicketsPourTech().subscribe({ next: handleData });
        } else if (currentPath === 'tickets/assigned') {
            this.ticketService.obtenirTicketsAssignes().subscribe({ next: handleData });
        } else {
            if (this.role === 'ADMIN') {
                this.ticketService.obtenirTousLesTickets().subscribe({ next: handleData });
            } else if (this.role === 'CLIENT') {
                this.ticketService.obtenirMesTickets().subscribe({ next: handleData });
            } else if (this.role === 'TECHNICIEN') {
                this.ticketService.obtenirTicketsAssignes().subscribe({ next: handleData });
            }
        }
    }
    loadProjects(): void {
        this.projectService.obtenirProjetsParClient(this.userId).subscribe({
            next: (data: any) => this.projects = data
        });
    }
    applyFilters(): void {
        this.filteredTickets = (this.tickets as any[]).filter((t: any) => {
            const matchStatus = this.filters.statut === 'TOUS' || t.statut === this.filters.statut;
            const matchProject = this.filters.projetId === 0 || t.projet?.id == this.filters.projetId;
            const titre = t.titre ? (t.titre as any).toLowerCase() : '';
            const description = t.description ? (t.description as any).toLowerCase() : '';
            const matchSearch = !this.filters.search ||
                titre.includes((this.filters.search as any).toLowerCase()) ||
                description.includes((this.filters.search as any).toLowerCase());
            return matchStatus && matchProject && matchSearch;
        });
        this.cdr.detectChanges();
    }
    loadTechniciens(): void {
        this.adminService.obtenirTechniciens().subscribe({
            next: (data: any) => {
                this.techniciens = (data as any[]).filter((t: any) => t.active === true);
                this.cdr.detectChanges();
            }
        });
    }
    assignTicket(ticket: Ticket, event: any): void {
        const techId = event.target.value;
        if (techId) {
            this.ticketService.assignerTicket(ticket.id, techId).subscribe({
                next: () => {
                    alert('Technicien assigné !');
                    this.loadTickets();
                },
                error: (err) => alert('Erreur assignation')
            });
        }
    }
    startEdit(ticket: Ticket, event: Event): void {
        event.stopPropagation();
        this.editingTicketId = ticket.id;
        this.editTechnicienId = ticket.technicien?.id ?? null;
        this.editStatus = ticket.statut ?? null;
    }
    cancelEdit(event?: Event): void {
        if (event) { event.stopPropagation(); }
        this.editingTicketId = null;
        this.editTechnicienId = null;
        this.editStatus = null;
    }
    saveEdit(ticket: Ticket, event?: Event): void {
        if (event) { event.stopPropagation(); }
        const promises: any[] = [];
        const applyAssign = () => {
            return new (window as any).Promise((resolve: any, reject: any) => {
                if (this.editTechnicienId != null && this.editTechnicienId !== ticket.technicien?.id) {
                    this.ticketService.assignerTicket(ticket.id, this.editTechnicienId).subscribe({
                        next: () => resolve(true),
                        error: (err) => reject(err)
                    });
                } else {
                    resolve(true);
                }
            });
        };
        const applyStatus = () => {
            return new (window as any).Promise((resolve: any, reject: any) => {
                if (this.editStatus && this.editStatus !== ticket.statut) {
                    this.ticketService.mettreAJourStatut(ticket.id, this.editStatus).subscribe({
                        next: () => resolve(true),
                        error: (err) => reject(err)
                    });
                } else {
                    resolve(true);
                }
            });
        };
        applyAssign()
            .then(() => applyStatus())
            .then(() => {
                alert('Modifications enregistrées');
                this.cancelEdit();
                this.loadTickets();
            })
            .catch((err: any) => {
                console.error('Erreur sauvegarde', err);
                alert('Erreur lors de la sauvegarde');
            });
    }
    deleteTicket(ticket: Ticket, event: Event): void {
        event.stopPropagation();
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action est irréversible.')) {
            return;
        }
        this.ticketService.supprimerTicket(ticket.id).subscribe({
            next: () => {
                alert('Ticket supprimé');
                this.loadTickets();
            },
            error: (err) => {
                console.error('Erreur suppression', err);
                alert('Erreur : impossible de supprimer le ticket');
            }
        });
    }
    updateStatus(ticket: Ticket, event: any): void {
        const newStatus = event.target.value;
        this.ticketService.mettreAJourStatut(ticket.id, newStatus).subscribe({
            next: () => {
                this.loadTickets();
            },
            error: (err) => alert('Erreur changement statut')
        });
    }
    isAssignedToMe(ticket: Ticket): boolean {
        return ticket.technicien?.id === this.userId;
    }
    takeCharge(ticket: Ticket): void {
        if (!confirm('Êtes-vous sûr de vouloir prendre ce ticket en charge ?')) {
            return;
        }
        this.ticketService.prendreEnCharge(ticket.id).subscribe({
            next: () => {
                alert('Ticket pris en charge !');
                this.loadTickets();
            },
            error: (err) => {
                console.error('Erreur prise en charge', err);
                alert('Erreur : Impossible de prendre le ticket en charge');
            }
        });
    }
    markAsInProgress(ticket: Ticket): void {
        if (!confirm('Êtes-vous sûr de vouloir commencer le travail sur ce ticket ?')) {
            return;
        }
        this.ticketService.mettreAJourStatut(ticket.id, 'EN_COURS').subscribe({
            next: () => {
                alert('Ticket marqué comme EN_COURS !');
                this.loadTickets();
            },
            error: (err) => {
                console.error('Erreur changement statut', err);
                alert('Erreur : Impossible de changer le statut du ticket');
            }
        });
    }
    resolveTicket(ticket: Ticket): void {
        if (!confirm('Êtes-vous sûr de vouloir marquer ce ticket comme résolu ?')) {
            return;
        }
        this.ticketService.resoudreTicket(ticket.id).subscribe({
            next: () => {
                alert('Ticket marqué comme résolu !');
                this.loadTickets();
            },
            error: (err) => {
                console.error('Erreur résolution', err);
                alert('Erreur : Impossible de résoudre le ticket');
            }
        });
    }
}

