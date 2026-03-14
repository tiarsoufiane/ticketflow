export interface DemandeInscription {
    nom: string;
    prenom: string;
    email: string;
    password?: string;
    entreprise?: string;
    telephone?: string;
    specialite?: string;
    role: string;
}
export interface DemandeCreationProjet {
    nom: string;
    description: string;
    dateDebut?: string;
    dateLivraison: string;
    clientId: number;
}

