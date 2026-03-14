import { Component, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { DemandeInscription } from '../../../models/request.model';
@Component({
    selector: 'app-technicien-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './technicien-create.component.html',
    styleUrls: ['./technicien-create.component.css']
})
export class TechnicienCreateComponent {
    private readonly adminService = inject(AdminService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    form: DemandeInscription = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'tech'
    };
    isPasswordVisible = false;
    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
    isSuccessful = false;
    isSignUpFailed = false;
    errorMessage = '';
    onSubmit(): void {
        this.adminService.creerTechnicien(this.form).subscribe({
            next: (data: any) => {
                this.ngZone.run(() => {
                    this.isSuccessful = true;
                    this.isSignUpFailed = false;
                    this.cdr.detectChanges();
                    setTimeout(() => this.ngZone.run(() => this.router.navigate(['/admin/techniciens'])), 1500);
                });
            },
            error: (err: any) => {
                this.ngZone.run(() => {
                    this.errorMessage = err.error?.message || err.error || "Erreur création technicien";
                    this.isSignUpFailed = true;
                    this.cdr.detectChanges();
                });
            }
        });
    }
}

