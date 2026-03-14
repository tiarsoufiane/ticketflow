import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { ProjectService } from '../../../services/project.service';
@Component({
    selector: 'app-project-create',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './project-create.html',
    styleUrls: ['./project-create.css']
})
export class ProjectCreate implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly projectService = inject(ProjectService);
    private readonly router = inject(Router);
    form: any = {
        nom: null,
        description: null,
        dateLivraison: null,
        clientId: null
    };
    clients: any[] = [];
    errorMessage = '';
    ngOnInit(): void {
        this.adminService.obtenirClients().subscribe({
            next: (data: any) => {
                this.clients = data;
            },
            error: (err: any) => {
            }
        });
    }
    onSubmit(): void {
        this.projectService.creerProjet(this.form).subscribe({
            next: () => {
                this.router.navigate(['/projects']);
            },
            error: (err: any) => {
                this.errorMessage = err.error.message || "Erreur lors de la création du projet.";
            }
        });
    }
}

