import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageContact, RequeteMessageContact } from '../models/message-contact.model';
import { API_CONFIG } from '../config/api.config';
@Injectable({
    providedIn: 'root'
})
export class ServiceMessageContact {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${API_CONFIG.baseUrl}/api/contact`;
    private readonly unreadCountSubject = new BehaviorSubject<number>(0);
    public readonly unreadCount$ = this.unreadCountSubject.asObservable();
    private readonly clientUnreadCountSubject = new BehaviorSubject<number>(0);
    public readonly clientUnreadCount$ = this.clientUnreadCountSubject.asObservable();
    envoyerMessage(requete: RequeteMessageContact): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(this.apiUrl, requete).pipe(
            tap(() => this.rafraichirNombreNonLus())
        );
    }
    obtenirTousLesMessages(): Observable<MessageContact[]> {
        return this.http.get<MessageContact[]>(this.apiUrl);
    }
    obtenirMesMessages(): Observable<MessageContact[]> {
        return this.http.get<MessageContact[]>(`${this.apiUrl}/my-messages`);
    }
    obtenirNombreNonLus(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`).pipe(
            tap(res => this.unreadCountSubject.next(res.count))
        );
    }
    obtenirMonNombreNonLus(): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.apiUrl}/my-messages/unread-count`).pipe(
            tap(res => this.clientUnreadCountSubject.next(res.count))
        );
    }
    marquerCommeLu(id: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/read`, {}).pipe(
            tap(() => this.rafraichirNombreNonLus())
        );
    }
    marquerCommeLuParClient(id: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/mark-read-by-client`, {}).pipe(
            tap(() => this.rafraichirNombreNonLusClient())
        );
    }
    repondreAuMessage(id: number, reponse: string): Observable<MessageContact> {
        return this.http.put<MessageContact>(`${this.apiUrl}/${id}/reply`, { reponse }).pipe(
            tap(() => this.rafraichirNombreNonLus())
        );
    }
    clientRepondAuMessage(id: number, reponseClient: string): Observable<MessageContact> {
        return this.http.put<MessageContact>(`${this.apiUrl}/${id}/client-reply`, { reponseClient }).pipe(
            tap(() => this.rafraichirNombreNonLusClient())
        );
    }
    supprimerMessage(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
            tap(() => this.rafraichirNombreNonLus())
        );
    }
    private rafraichirNombreNonLus(): void {
        this.obtenirNombreNonLus().subscribe();
    }
    private rafraichirNombreNonLusClient(): void {
        this.obtenirMonNombreNonLus().subscribe();
    }
}

