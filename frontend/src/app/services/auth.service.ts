import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utilisateur } from '../models/user.model';
import { API_CONFIG } from '../config/api.config';
const AUTH_API = `${API_CONFIG.baseUrl}/api/auth/`;
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  connexion(credentials: any): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      email: credentials.email,
      password: credentials.password
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map((data: any) => {
        if (data.accessToken) {
          this.saveToken(data.accessToken);
          this.saveUser(data);
        } else if (data.token) {
          this.saveToken(data.token);
          this.saveUser(data);
        }
        return data;
      })
    );
  }
  inscription(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  deconnexion(): void {
    window.sessionStorage.clear();
    window.localStorage.clear();
  }
  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }
  public estConnecte(): boolean {
    const token = window.localStorage.getItem(TOKEN_KEY);
    return !!token;
  }
}

