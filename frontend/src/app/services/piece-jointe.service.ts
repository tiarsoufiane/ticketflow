import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PieceJointe } from '../models/piece-jointe.model';
import { API_CONFIG } from '../config/api.config';
@Injectable({
    providedIn: 'root'
})
export class PieceJointeService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_CONFIG.baseUrl}/api/pieces-jointes`;
    televerserFichiers(ticketId: number, fichiers: File[]): Observable<PieceJointe[]> {
        const formData = new FormData();
        fichiers.forEach(fichier => {
            formData.append('files', fichier);
        });
        return this.http.post<PieceJointe[]>(`${this.apiUrl}/upload/${ticketId}`, formData);
    }
    obtenirPiecesJointesParTicket(ticketId: number): Observable<PieceJointe[]> {
        return this.http.get<PieceJointe[]>(`${this.apiUrl}/ticket/${ticketId}`);
    }
    telechargerFichier(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/download/${id}`, {
            responseType: 'blob'
        });
    }
    supprimerPieceJointe(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}

