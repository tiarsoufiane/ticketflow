import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { Commentaire } from '../models/commentaire.model';
import { API_CONFIG } from '../config/api.config';
const TICKET_API = `${API_CONFIG.baseUrl}/api/tickets`;
@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private readonly http = inject(HttpClient);
    obtenirTousLesTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(TICKET_API);
    }
    obtenirTousLesTicketsPourTech(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${TICKET_API}/tech/all`);
    }
    obtenirMesTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${TICKET_API}/client`);
    }
    obtenirTicketsParProjet(projectId: number): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${TICKET_API}/project/${projectId}`);
    }
    obtenirStatsClient(): Observable<any> {
        return this.http.get<any>(`${TICKET_API}/client/stats`);
    }
    creerTicket(ticket: any): Observable<any> {
        return this.http.post(`${TICKET_API}/create`, ticket);
    }
    obtenirTicketsAssignes(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${TICKET_API}/tech`);
    }
    mettreAJourStatut(id: number, status: string): Observable<any> {
        return this.http.put(`${TICKET_API}/${id}/status/${status}`, {});
    }
    assignerTicket(id: number, techId: number): Observable<any> {
        return this.http.put(`${TICKET_API}/${id}/assign/${techId}`, {});
    }
    prendreEnCharge(id: number): Observable<any> {
        return this.http.put(`${TICKET_API}/${id}/take-charge`, {});
    }
    resoudreTicket(id: number): Observable<any> {
        return this.http.put(`${TICKET_API}/${id}/resolve`, {});
    }
    supprimerTicket(id: number): Observable<any> {
        return this.http.delete(`${TICKET_API}/${id}`);
    }
    obtenirTicketParId(id: number): Observable<Ticket> {
        return this.http.get<Ticket>(`${TICKET_API}/${id}`);
    }
    obtenirCommentaires(ticketId: number): Observable<Commentaire[]> {
        return this.http.get<Commentaire[]>(`${API_CONFIG.baseUrl}/api/commentaires/ticket/${ticketId}`);
    }
    ajouterCommentaire(commentaire: any): Observable<any> {
        return this.http.post(`${API_CONFIG.baseUrl}/api/commentaires/create`, commentaire);
    }
    modifierCommentaire(id: number, contenu: string): Observable<any> {
        return this.http.put(`${API_CONFIG.baseUrl}/api/commentaires/${id}`, { contenu: contenu });
    }
    supprimerCommentaire(id: number): Observable<any> {
        return this.http.delete(`${API_CONFIG.baseUrl}/api/commentaires/${id}`);
    }
}

