import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceMessageContact } from '../../../services/service-message-contact.service';
import { MessageContact } from '../../../models/message-contact.model';
@Component({
    selector: 'app-client-messages',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './client-messages.component.html',
    styleUrls: ['./client-messages.component.css']
})
export class ClientMessagesComponent implements OnInit {
    private readonly serviceMessageContact = inject(ServiceMessageContact);
    private readonly cdr = inject(ChangeDetectorRef);
    messages: any[] = [];
    isLoading = true;
    selectedMessage: MessageContact | null = null;
    replyText = '';
    isReplying = false;
    ngOnInit(): void {
        this.chargerMessages();
    }
    chargerMessages(): void {
        this.isLoading = true;
        this.cdr.detectChanges();
        this.serviceMessageContact.obtenirMesMessages().subscribe({
            next: (messages: any[]) => {
                this.messages = messages;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }
    ouvrirMessage(message: MessageContact): void {
        this.selectedMessage = message;
        this.replyText = '';
        if (message.reponse && !message.luParClient) {
            this.serviceMessageContact.marquerCommeLuParClient(message.id).subscribe({
                next: () => {
                    const updatedMessage = { ...message, luParClient: true };
                    const index = (this.messages as any[]).findIndex((m: any) => m.id === message.id);
                    if (index !== -1) {
                        this.messages[index] = updatedMessage;
                    }
                    this.selectedMessage = updatedMessage;
                    this.cdr.detectChanges();
                },
                error: () => { }
            });
        }
    }
    fermerMessage(): void {
        this.selectedMessage = null;
        this.replyText = '';
    }
    envoyerReponse(): void {
        if (!this.selectedMessage || !(this.replyText as any).trim()) return;
        this.isReplying = true;
        this.serviceMessageContact.clientRepondAuMessage(this.selectedMessage.id, this.replyText).subscribe({
            next: (updatedMessage: any) => {
                const index = (this.messages as any[]).findIndex((m: any) => m.id === updatedMessage.id);
                if (index !== -1) {
                    this.messages[index] = updatedMessage;
                }
                this.selectedMessage = updatedMessage;
                this.replyText = '';
                this.isReplying = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.isReplying = false;
            }
        });
    }
    formaterDate(dateStr: string): string {
        const date = new (window as any).Date(dateStr);
        return (date as any).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

