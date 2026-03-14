import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    clients: any[] = [];
    errorMessage = '';
    ngOnInit(): void {
        this.loadClients();
    }
    loadClients(): void {
        this.adminService.obtenirClients().subscribe({
            next: (data: any) => {
                this.clients = data;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.errorMessage = err.error?.message || 'Erreur lors de la récupération des clients';
                this.cdr.detectChanges();
            }
        });
    }
    deleteClient(id: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            this.adminService.supprimerUtilisateur(id).subscribe({
                next: (res: any) => {
                    this.loadClients();
                },
                error: (err: any) => {
                    this.errorMessage = 'Erreur lors de la suppression';
                    this.cdr.detectChanges();
                }
            });
        }
    }
}

