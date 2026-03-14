import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
@Component({
    selector: 'app-technicien-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './technicien-list.component.html',
    styleUrls: ['./technicien-list.component.css']
})
export class TechnicienListComponent implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    utilisateursEnAttente: any[] = [];
    techniciens: any[] = [];
    ngOnInit(): void {
        this.loadTechniciens();
    }
    loadTechniciens(): void {
        this.adminService.obtenirTechniciens().subscribe({
            next: (data: any[]) => {
                this.techniciens = data;
                this.cdr.detectChanges();
            },
            error: () => {
                this.cdr.detectChanges();
            }
        });
    }
    deleteTechnicien(id: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce technicien ?')) {
            this.adminService.supprimerUtilisateur(id).subscribe({
                next: () => {
                    this.loadTechniciens();
                },
                error: () => { }
            });
        }
    }
}

