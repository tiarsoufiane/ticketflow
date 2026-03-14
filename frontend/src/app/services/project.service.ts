import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet.model';
import { DemandeCreationProjet } from '../models/request.model';
import { API_CONFIG } from '../config/api.config';
const API_PROJET = `${API_CONFIG.baseUrl}/api/projets`;
@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private readonly http = inject(HttpClient);
    obtenirTousLesProjets(): Observable<Projet[]> {
        return this.http.get<Projet[]>(API_PROJET);
    }
    obtenirProjetsParClient(clientId: number): Observable<Projet[]> {
        return this.http.get<Projet[]>(`${API_PROJET}/client/${clientId}`);
    }
    creerProjet(projet: DemandeCreationProjet): Observable<any> {
        return this.http.post(`${API_PROJET}`, projet);
    }
    obtenirProjetParId(id: number): Observable<Projet> {
        return this.http.get<Projet>(`${API_PROJET}/${id}`);
    }
    modifierProjet(id: number, projet: DemandeCreationProjet): Observable<any> {
        return this.http.put(`${API_PROJET}/${id}`, projet);
    }
    supprimerProjet(id: number): Observable<any> {
        return this.http.delete(`${API_PROJET}/${id}`);
    }
}

