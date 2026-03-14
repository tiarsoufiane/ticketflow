import { Utilisateur } from './user.model';
export interface Commentaire {
    id?: number;
    contenu: string;
    dateCommentaire: string;
    auteurId: number;
    auteur?: Utilisateur;
    ticketId: number;
}

