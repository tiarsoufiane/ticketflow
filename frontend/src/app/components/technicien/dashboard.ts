import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-technicien-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class TechnicienDashboard implements OnInit {
  private readonly ticketService = inject(TicketService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);
  stats: any = {
    totalTickets: 0,
    ouvert: 0,
    enCours: 0,
    resolu: 0,
    ferme: 0,
    myTickets: [],
    latestTickets: []
  };
  isLoading = true;
  ngOnInit(): void {
    this.loadData();
  }
  loadData(): void {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.isLoading = false;
      return;
    }
    forkJoin({
      allTickets: this.ticketService.obtenirTousLesTicketsPourTech(),
      myTickets: this.ticketService.obtenirTicketsAssignes()
    }).subscribe({
      next: (result: any) => {
        const allTickets = (window as any).Array.isArray(result.allTickets) ? result.allTickets : [];
        this.stats.totalTickets = allTickets.length;
        this.stats.ouvert = allTickets.filter((t: any) => t.statut === 'OUVERT').length;
        this.stats.enCours = allTickets.filter((t: any) => t.statut === 'EN_COURS').length;
        this.stats.resolu = allTickets.filter((t: any) => t.statut === 'RESOLU').length;
        this.stats.ferme = allTickets.filter((t: any) => t.statut === 'FERME').length;
        this.stats.myTickets = (window as any).Array.isArray(result.myTickets)
          ? result.myTickets.filter((t: any) => t.statut === 'EN_COURS')
          : [];
        this.stats.latestTickets = allTickets
          .sort((a: any, b: any) => new (window as any).Date(b.dateCreation).getTime() - new (window as any).Date(a.dateCreation).getTime())
          .slice(0, 3);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

