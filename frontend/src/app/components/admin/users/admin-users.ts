import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-users.html',
    styleUrls: ['./admin-users.css']
})
export class AdminUsers implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    utilisateursEnAttente: any[] = [];
    message = '';
    idEnConfirmation: number | null = null;
    ngOnInit(): void {
        this.loadPendingUsers();
    }
    loadPendingUsers(): void {
        this.adminService.obtenirUtilisateursEnAttente().subscribe({
            next: (data: any) => {
                this.ngZone.run(() => {
                    this.utilisateursEnAttente = data;
                    this.cdr.detectChanges();
                });
            },
            error: () => {
                this.ngZone.run(() => {
                    this.cdr.detectChanges();
                });
            }
        });
    }
    validateUser(id: number): void {
        if (this.idEnConfirmation !== id) {
            this.idEnConfirmation = id;
            setTimeout(() => {
                this.ngZone.run(() => {
                    if (this.idEnConfirmation === id) this.idEnConfirmation = null;
                    this.cdr.detectChanges();
                });
            }, 5000);
            return;
        }
        this.adminService.validerUtilisateur(id).subscribe({
            next: () => {
                this.ngZone.run(() => {
                    this.message = "Utilisateur validé avec succès !";
                    this.idEnConfirmation = null;
                    this.loadPendingUsers();
                    setTimeout(() => {
                        this.ngZone.run(() => {
                            this.message = '';
                            this.cdr.detectChanges();
                        });
                    }, 3000);
                    this.cdr.detectChanges();
                });
            },
            error: () => {
                this.ngZone.run(() => {
                    this.message = "Erreur lors de la validation.";
                    this.idEnConfirmation = null;
                    this.cdr.detectChanges();
                });
            }
        });
    }
    getRoleIcon(role: string): string {
        switch (role) {
            case 'ADMIN': return 'assets/icons/admin.png';
            case 'TECHNICIEN': return 'assets/icons/technicien.png';
            case 'CLIENT': return 'assets/icons/client.png';
            default: return 'assets/icons/client.png';
        }
    }
}

