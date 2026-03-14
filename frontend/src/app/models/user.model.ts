export enum Role {
    CLIENT = 'CLIENT',
    TECHNICIEN = 'TECHNICIEN',
    ADMIN = 'ADMIN'
}
export interface Utilisateur {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password?: string;
    role: Role;
    active: boolean;
    telephone?: string;
    entreprise?: string;
    niveau?: string;
    specialite?: string;
}
export type User = Utilisateur;

