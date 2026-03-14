import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html'
})
export class Signup {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cd = inject(ChangeDetectorRef);
  form: any = {
    nom: null,
    prenom: null,
    email: null,
    password: null,
    role: 'CLIENT',
    entreprise: null,
    telephone: null,
    specialite: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  onSubmit(): void {
    const { nom, prenom, email, password, role, entreprise, telephone, specialite } = this.form;
    const utilisateur = {
      nom,
      prenom,
      email,
      password,
      role: role,
      entreprise: role === 'CLIENT' ? entreprise : null,
      telephone: role === 'CLIENT' ? telephone : null,
      specialite: role === 'TECHNICIEN' ? specialite : null
    };
    this.authService.inscription(utilisateur).subscribe({
      next: (data: any) => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = err.error.message || err.error || "Erreur lors de l'inscription";
        this.isSignUpFailed = true;
        this.cd.detectChanges();
      }
    });
  }
}

