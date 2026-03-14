import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ServiceMessageContact } from '../../../services/service-message-contact.service';
import { Subscription, filter, interval } from 'rxjs';
@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.html',
    styleUrls: ['./sidebar.css']
})
export class Sidebar implements OnInit, OnDestroy {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly serviceMessageContact = inject(ServiceMessageContact);
    private readonly cdr = inject(ChangeDetectorRef);
    role: string = '';
    unreadCount: number = 0;
    clientUnreadCount: number = 0;
    private routerSub?: Subscription;
    private pollingSub?: Subscription;
    private unreadCountSub?: Subscription;
    private clientUnreadCountSub?: Subscription;
    ngOnInit(): void {
        const utilisateur = this.authService.getUser();
        if (utilisateur) {
            this.role = utilisateur.role;
            if (this.role === 'ADMIN') {
                this.unreadCountSub = this.serviceMessageContact.unreadCount$.subscribe((count: any) => {
                    this.unreadCount = count;
                    this.cdr.detectChanges();
                });
                this.chargerCompteurNonLus();
                setTimeout(() => this.chargerCompteurNonLus(), 300);
                setTimeout(() => this.chargerCompteurNonLus(), 800);
                setTimeout(() => this.chargerCompteurNonLus(), 1500);
                this.routerSub = this.router.events.pipe(
                    filter(event => event instanceof NavigationEnd)
                ).subscribe(() => {
                    this.chargerCompteurNonLus();
                });
                this.pollingSub = interval(30000).subscribe(() => {
                    this.chargerCompteurNonLus();
                });
            }
            if (this.role === 'CLIENT') {
                this.clientUnreadCountSub = this.serviceMessageContact.clientUnreadCount$.subscribe((count: any) => {
                    this.clientUnreadCount = count;
                    this.cdr.detectChanges();
                });
                this.chargerCompteurNonLusClient();
                setTimeout(() => this.chargerCompteurNonLusClient(), 300);
                setTimeout(() => this.chargerCompteurNonLusClient(), 800);
                setTimeout(() => this.chargerCompteurNonLusClient(), 1500);
                this.routerSub = this.router.events.pipe(
                    filter(event => event instanceof NavigationEnd)
                ).subscribe(() => {
                    this.chargerCompteurNonLusClient();
                });
                this.pollingSub = interval(30000).subscribe(() => {
                    this.chargerCompteurNonLusClient();
                });
            }
        }
    }
    ngOnDestroy(): void {
        this.routerSub?.unsubscribe();
        this.pollingSub?.unsubscribe();
        this.unreadCountSub?.unsubscribe();
        this.clientUnreadCountSub?.unsubscribe();
    }
    chargerCompteurNonLus(): void {
        this.serviceMessageContact.obtenirNombreNonLus().subscribe({
            next: (res) => {
                this.unreadCount = res.count;
                this.cdr.detectChanges();
            },
            error: (err: any) => console.error('Échec du chargement du compteur non lus:', err)
        });
    }
    chargerCompteurNonLusClient(): void {
        this.serviceMessageContact.obtenirMonNombreNonLus().subscribe({
            next: (res) => {
                this.clientUnreadCount = res.count;
                this.cdr.detectChanges();
            },
            error: (err: any) => console.error('Échec du chargement du compteur client non lus:', err)
        });
    }
    deconnexion(): void {
        this.authService.deconnexion();
        this.router.navigate(['/login']);
    }
}
