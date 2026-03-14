import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../services/ticket.service';
import { AuthService } from '../../../services/auth.service';
import { PieceJointeService } from '../../../services/piece-jointe.service';
import { Ticket } from '../../../models/ticket.model';
import { Commentaire } from '../../../models/commentaire.model';
import { PieceJointe } from '../../../models/piece-jointe.model';
@Component({
    selector: 'app-ticket-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './ticket-detail.component.html',
    styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly ticketService = inject(TicketService);
    private readonly authService = inject(AuthService);
    private readonly pieceJointeService = inject(PieceJointeService);
    private readonly cdr = inject(ChangeDetectorRef);
    ticket: any = null;
    comments: any[] = [];
    attachments: any[] = [];
    newComment: string = '';
    isLoading = true;
    errorMessage = '';
    currentUser: any = null;
    editingCommentId: number | null = null;
    editedContent: string = '';
    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.chargerBillet(+id);
            this.chargerPiecesJointes(+id);
        }
    }
    chargerBillet(id: number): void {
        this.ticketService.obtenirTicketParId(id).subscribe({
            next: (data: any) => {
                this.ticket = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.errorMessage = "Erreur chargement ticket";
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });

        this.ticketService.obtenirCommentaires(id).subscribe({
            next: (data: any) => {
                this.comments = data;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                console.error("Erreur chargement commentaires", err);
            }
        });
    }
    chargerPiecesJointes(id: number): void {
        this.pieceJointeService.obtenirPiecesJointesParTicket(id).subscribe({
            next: (data: any) => {
                this.attachments = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.cdr.detectChanges();
            }
        });
    }
    downloadAttachment(attachment: PieceJointe): void {
        this.pieceJointeService.telechargerFichier(attachment.id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = attachment.nomFichier;
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                alert('Erreur lors du téléchargement du fichier');
            }
        });
    }
    soumettreCommentaire(): void {
        if (!this.newComment.trim() || !this.ticket) return;
        const commentData = {
            contenu: this.newComment,
            ticketId: this.ticket.id
        };
        this.ticketService.ajouterCommentaire(commentData).subscribe({
            next: () => {
                this.newComment = '';
                if (this.ticket) this.chargerBillet(this.ticket.id);
            },
            error: (err) => {
                alert("Erreur envoi commentaire");
            }
        });
    }
    isTechnicien(): boolean {
        return this.currentUser && this.currentUser.role === 'TECHNICIEN';
    }
    isAssignedToMe(): boolean {
        if (!this.ticket || !this.ticket.technicien || !this.currentUser) return false;
        return this.ticket.technicien.id === this.currentUser.id;
    }
    prendreEnCharge(): void {
        if (!this.ticket || !this.currentUser) return;
        this.ticketService.prendreEnCharge(this.ticket.id).subscribe({
            next: (data: any) => {
                this.ticket = data.ticket;
                alert("Ticket pris en charge avec succès!");
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                alert("Erreur : Impossible de prendre le ticket en charge");
            }
        });
    }
    marquerCommeResolu(): void {
        if (!this.ticket || !this.currentUser) return;
        this.ticketService.resoudreTicket(this.ticket.id).subscribe({
            next: (data: any) => {
                this.ticket = data.ticket;
                alert("Ticket marqué comme résolu!");
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                alert("Erreur : Impossible de résoudre le ticket");
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
    canEditComment(comment: Commentaire): boolean {
        return this.currentUser && comment.auteur && comment.auteur.id === this.currentUser.id;
    }
    startEdit(comment: Commentaire): void {
        this.editingCommentId = comment.id || null;
        this.editedContent = comment.contenu;
    }
    cancelEdit(): void {
        this.editingCommentId = null;
        this.editedContent = '';
    }
    sauvegarderModification(commentId: number): void {
        if (!this.editedContent.trim()) return;
        this.ticketService.modifierCommentaire(commentId, this.editedContent).subscribe({
            next: () => {
                this.editingCommentId = null;
                this.editedContent = '';
                if (this.ticket) this.chargerBillet(this.ticket.id);
            },
            error: (err) => {
                alert('Erreur lors de la modification du commentaire');
            }
        });
    }
    supprimerCommentaire(commentId: number): void {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;
        this.ticketService.supprimerCommentaire(commentId).subscribe({
            next: () => {
                if (this.ticket) this.chargerBillet(this.ticket.id);
            },
            error: (err) => {
                alert('Erreur lors de la suppression du commentaire');
            }
        });
    }
}

