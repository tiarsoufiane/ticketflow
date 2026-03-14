import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly cd = inject(ChangeDetectorRef);
    form: any = {
        email: '',
        password: ''
    };
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    roles: string[] = [];
    isPasswordVisible = false;
    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
    ngOnInit(): void {
        if (this.authService.estConnecte()) {
            this.isLoggedIn = true;
            const utilisateur = this.authService.getUser();
            this.roles = utilisateur.role ? [utilisateur.role] : [];
            this.redirigerUtilisateur();
        }
    }
    onSubmit(): void {
        const { email, password } = this.form;
        this.isLoginFailed = false;
        this.errorMessage = '';
        this.authService.connexion({ email, password }).subscribe({
            next: data => {
                this.authService.saveToken(data.accessToken || data.token);
                this.authService.saveUser(data);
                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.roles = data.role ? [data.role] : [];
                this.redirigerUtilisateur();
            },
            error: err => {
                this.isLoginFailed = true;
                if (err.error) {
                    if (err.error.message) {
                        this.errorMessage = err.error.message;
                    } else if (typeof err.error === 'string') {
                        this.errorMessage = err.error;
                    } else {
                        this.errorMessage = 'Email ou mot de passe incorrect';
                    }
                } else {
                    this.errorMessage = 'Impossible de contacter le serveur';
                }
                this.cd.detectChanges();
            }
        });
    }
    redirigerUtilisateur(): void {
        const utilisateur = this.authService.getUser();
        const role = utilisateur?.role || utilisateur?.roles?.[0];
        if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin/dashboard']);
        } else if (role === 'TECHNICIEN' || role === 'ROLE_TECHNICIEN') {
            this.router.navigate(['/technicien-dashboard']);
        } else {
            this.router.navigate(['/dashboard']);
        }
    }
}

