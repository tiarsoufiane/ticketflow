import { Component, OnInit, ChangeDetectorRef, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    private readonly adminService = inject(AdminService);
    private readonly cd = inject(ChangeDetectorRef);
    private readonly ngZone = inject(NgZone);

    stats: any = {};
    errorMessage = '';
    ngOnInit(): void {
        this.loadStats();
    }
    loadStats(): void {
        this.adminService.obtenirStats().subscribe({
            next: (data: any) => {
                this.ngZone.run(() => {
                    this.stats = data;
                    this.cd.detectChanges();
                });
            },
            error: (err: any) => {
                this.ngZone.run(() => {
                    console.error("AdminDashboard: Stats fetch error:", err);
                    this.errorMessage = err.error?.message || 'Error fetching stats';
                    this.cd.detectChanges();
                });
            }
        });
    }
}

