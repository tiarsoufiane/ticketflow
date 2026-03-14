import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/user.model';
import { DemandeInscription } from '../models/request.model';
import { API_CONFIG } from '../config/api.config';
const ADMIN_API = `${API_CONFIG.baseUrl}/api/admin/`;
@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    obtenirStats(): Observable<any> {
        return this.http.get(ADMIN_API + 'stats');
    }
    obtenirClients(): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(ADMIN_API + 'clients');
    }
    obtenirTechniciens(): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(ADMIN_API + 'techniciens');
    }
    creerClient(client: DemandeInscription): Observable<any> {
        client.role = 'client';
        return this.http.post(ADMIN_API + 'clients', client);
    }
    creerTechnicien(tech: DemandeInscription): Observable<any> {
        tech.role = 'tech';
        return this.http.post(ADMIN_API + 'techniciens', tech);
    }
    obtenirUtilisateursEnAttente(): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(ADMIN_API + 'users/pending');
    }
    validerUtilisateur(id: number): Observable<any> {
        return this.http.put(ADMIN_API + 'users/' + id + '/validate', {});
    }
    obtenirUtilisateurParId(id: number): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(ADMIN_API + 'users/' + id);
    }
    modifierUtilisateur(id: number, user: DemandeInscription): Observable<any> {
        return this.http.put(ADMIN_API + 'users/' + id, user);
    }
    supprimerUtilisateur(id: number): Observable<any> {
        return this.http.delete(ADMIN_API + 'users/' + id);
    }
}

