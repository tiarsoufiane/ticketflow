import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { DemandeCreationProjet } from '../../../models/request.model';
@Component({
    selector: 'app-project-create',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './project-create.component.html',
    styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent implements OnInit {
    private readonly projectService = inject(ProjectService);
    private readonly adminService = inject(AdminService);
    private readonly router = inject(Router);
    private readonly cd = inject(ChangeDetectorRef);

    form: DemandeCreationProjet = {
        nom: '',
        description: '',
        dateDebut: '',
        dateLivraison: '',
        clientId: 0
    };
    clients: User[] = [];
    errorMessage = '';
    get dateError(): boolean {
        if (!this.form.dateDebut || !this.form.dateLivraison) return false;
        return new (window as any).Date(this.form.dateLivraison) < new (window as any).Date(this.form.dateDebut);
    }
    loadClients(): void {
        this.adminService.obtenirClients().subscribe({
            next: (data: any) => {
                this.clients = data;
                this.cd.detectChanges();
            },
            error: () => { }
        });
    }
    ngOnInit(): void {
        this.loadClients();
    }
    onSubmit(): void {
        this.projectService.creerProjet(this.form).subscribe({
            next: () => {
                this.router.navigate(['/admin/projects']);
            },
            error: (err: any) => {
                this.errorMessage = err.error.message || err.error || "Erreur lors de la création du projet";
            }
        });
    }
}

