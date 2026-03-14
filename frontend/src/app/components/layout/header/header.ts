import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.html',
    styleUrls: ['./header.css']
})
export class Header implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    username: string = '';
    role: string = '';
    ngOnInit(): void {
        const utilisateur = this.authService.getUser();
        if (utilisateur) {
            this.username = utilisateur.prenom + ' ' + utilisateur.nom;
            this.role = utilisateur.role;
        }
    }
    getRoleIcon(): string {
        switch (this.role) {
            case 'ADMIN': return 'assets/icons/admin.png';
            case 'TECHNICIEN': return 'assets/icons/technicien.png';
            case 'CLIENT': return 'assets/icons/client.png';
            default: return 'assets/icons/client.png';
        }
    }
    deconnexion(): void {
        this.authService.deconnexion();
        this.router.navigate(['/login']);
    }
}
