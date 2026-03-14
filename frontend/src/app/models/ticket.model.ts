import { Projet } from './projet.model';
import { Utilisateur } from './user.model';
export enum TicketStatus {
    OUVERT = 'OUVERT',
    EN_COURS = 'EN_COURS',
    RESOLU = 'RESOLU',
    FERME = 'FERME'
}
export enum TicketPriorite {
    BASSE = 'BASSE',
    MOYENNE = 'MOYENNE',
    HAUTE = 'HAUTE',
    CRITIQUE = 'CRITIQUE'
}
export interface Ticket {
    id: number;
    titre: string;
    description: string;
    statut: TicketStatus;
    priorite: TicketPriorite;
    dateCreation: Date;
    datePriseEnCharge?: Date;
    dateResolution?: Date;
    client: Utilisateur;
    projet: Projet;
    technicien?: Utilisateur;
}

