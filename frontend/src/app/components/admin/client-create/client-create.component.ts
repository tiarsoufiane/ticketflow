import { Component, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
@Component({
    selector: 'app-client-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './client-create.component.html',
    styleUrls: ['./client-create.component.css']
})
export class ClientCreateComponent {
    private readonly adminService = inject(AdminService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    form: any = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        entreprise: '',
        telephone: '',
        role: 'client'
    };
    isPasswordVisible = false;
    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
    isSuccessful = false;
    isSignUpFailed = false;
    errorMessage = '';
    onSubmit(): void {
        this.adminService.creerClient(this.form).subscribe({
            next: (data: any) => {
                this.isSuccessful = true;
                this.isSignUpFailed = false;
                this.cdr.detectChanges();
                setTimeout(() => this.router.navigate(['/admin/clients']), 1500);
            },
            error: (err: any) => {
                this.errorMessage = err.error?.message || err.error || 'Erreur lors de la création du client';
                this.isSignUpFailed = true;
                this.cdr.detectChanges();
            }
        });
    }
}

