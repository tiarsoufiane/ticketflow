import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { AuthService } from '../../../services/auth.service';
@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './project-list.html',
    styleUrls: ['./project-list.css']
})
export class ProjectList implements OnInit {
    private readonly projectService = inject(ProjectService);
    private readonly authService = inject(AuthService);
    private readonly cdr = inject(ChangeDetectorRef);
    projects: any[] = [];
    loading = true;
    ngOnInit(): void {
        this.loadProjects();
    }
    loadProjects(): void {
        const user = this.authService.getUser();
        if (user && user.id) {
            this.projectService.obtenirProjetsParClient(user.id).subscribe({
                next: (data: any) => {
                    this.projects = data;
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                error: (err: any) => {
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
        } else {
            this.loading = false;
        }
    }
}

