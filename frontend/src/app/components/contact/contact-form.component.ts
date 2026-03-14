import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceMessageContact } from '../../services/service-message-contact.service';
import { RequeteMessageContact } from '../../models/message-contact.model';
import { AuthService } from '../../services/auth.service';
@Component({
    selector: 'app-contact-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly serviceMessageContact = inject(ServiceMessageContact);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    contactForm!: FormGroup;
    isSubmitting = false;
    successMessage = '';
    errorMessage = '';
    ngOnInit(): void {
        const user = this.authService.getUser();
        const nomPrenom = user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : '';
        const entreprise = user?.entreprise || '';
        const telephone = user?.telephone || '';
        const email = user?.email || '';
        this.contactForm = this.fb.group({
            nomPrenom: [nomPrenom, [Validators.required, Validators.maxLength(20)]],
            entreprise: [entreprise, [Validators.maxLength(20)]],
            telephone: [telephone, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            email: [email, [Validators.required, Validators.email]],
            objet: ['', [Validators.required, Validators.maxLength(25)]],
            message: ['', [Validators.required, Validators.maxLength(500)]]
        });
    }
    onSubmit(): void {
        if (this.contactForm.invalid) {
            (window as any).Object.keys(this.contactForm.controls).forEach((key: string) => {
                this.contactForm.get(key)?.markAsTouched();
            });
            return;
        }
        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';
        const requete: RequeteMessageContact = this.contactForm.value;
        this.serviceMessageContact.envoyerMessage(requete).subscribe({
            next: () => {
                this.successMessage = 'Votre message a été envoyé avec succès!';
                this.isSubmitting = false;
                this.contactForm.patchValue({
                    objet: '',
                    message: ''
                });
                this.contactForm.markAsPristine();
                this.contactForm.markAsUntouched();
            },
            error: (err: any) => {
                this.errorMessage = err.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
                this.isSubmitting = false;
            }
        });
    }
    get f() {
        return this.contactForm.controls;
    }
    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}

