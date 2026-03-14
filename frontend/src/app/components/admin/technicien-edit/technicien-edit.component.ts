import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { DemandeInscription } from '../../../models/request.model';

@Component({
    selector: 'app-technicien-edit',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './technicien-edit.component.html',
    styleUrls: ['./technicien-edit.component.css']
})
export class TechnicienEditComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly adminService = inject(AdminService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    form: DemandeInscription = {
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'tech',
        specialite: ''
    };

    userId!: number;
    isSuccessful = false;
    isUpdateFailed = false;
    errorMessage = '';
    loading = true;
    showPassword = false;

    ngOnInit(): void {
        this.userId = (window as any).Number(this.route.snapshot.paramMap.get('id'));
        if (this.userId) {
            this.loadUser();
        }
    }

    loadUser(): void {
        this.adminService.obtenirUtilisateurParId(this.userId).subscribe({
            next: (data: any) => {
                this.ngZone.run(() => {
                    this.form = data;
                    this.form.password = '';
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            },
            error: (err: any) => {
                this.ngZone.run(() => {
                    this.errorMessage = "Impossible de charger les données du technicien";
                    this.loading = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    onSubmit(): void {
        this.adminService.modifierUtilisateur(this.userId, this.form).subscribe({
            next: (res: any) => {
                this.ngZone.run(() => {
                    this.isSuccessful = true;
                    this.isUpdateFailed = false;
                    this.cdr.detectChanges();
                    setTimeout(() => this.ngZone.run(() => this.router.navigate(['/admin/techniciens'])), 1500);
                });
            },
            error: (err: any) => {
                this.ngZone.run(() => {
                    this.errorMessage = err.error?.message || "Erreur lors de la mise à jour";
                    this.isUpdateFailed = true;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
        this.cdr.detectChanges();
    }
}

