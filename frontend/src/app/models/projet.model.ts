import { Utilisateur } from './user.model';
export interface Projet {
    id: number;
    nom: string;
    description: string;
    dateDebut?: Date;
    dateLivraison?: Date;
    statut: string;
    client?: Utilisateur;
    tickets?: any[];
}

