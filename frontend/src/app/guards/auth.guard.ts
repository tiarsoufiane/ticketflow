import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.estConnecte()) {
            const utilisateur = this.authService.getUser();
            const role = utilisateur?.role;
            if (state.url === '/' || state.url === '') {
                if (role === 'ADMIN') {
                    this.router.navigate(['/admin/dashboard']);
                    return false;
                } else if (role === 'TECHNICIEN') {
                    this.router.navigate(['/technicien-dashboard']);
                    return false;
                } else {
                    this.router.navigate(['/dashboard']);
                    return false;
                }
            }
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}

