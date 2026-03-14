import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class Dashboard implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  stats: any = {
    totalTickets: 0,
    ouvert: 0,
    enCours: 0,
    resolu: 0,
    ferme: 0,
    projets: [],
    latestTickets: []
  };
  loading = true;
  ngOnInit(): void {
    this.chargerDonnees();
  }
  chargerDonnees(): void {
    const utilisateur = this.authService.getUser();
    if (!utilisateur || !utilisateur.id) {
      this.loading = false;
      return;
    }
    forkJoin({
      stats: this.ticketService.obtenirStatsClient(),
      projects: this.projectService.obtenirProjetsParClient(utilisateur.id)
    }).subscribe({
      next: (resultat: any) => {
        this.stats = resultat.stats;
        if ((window as any).Array.isArray(resultat.projects)) {
          this.stats.projets = resultat.projects;
        } else {
          this.stats.projets = [];
        }
        if ((window as any).Array.isArray(this.stats.latestTickets)) {
          this.stats.latestTickets = this.stats.latestTickets.slice(0, 3);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (erreur: any) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

