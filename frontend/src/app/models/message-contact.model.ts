export interface MessageContact {
    readonly id: number;
    readonly nomPrenom: string;
    readonly entreprise?: string;
    readonly telephone: string;
    readonly email: string;
    readonly objet: string;
    readonly message: string;
    readonly dateEnvoi: string;
    readonly lu: boolean;
    readonly clientId: number;
    readonly reponse?: string;
    readonly dateReponse?: string;
    readonly reponseClient?: string;
    readonly dateReponseClient?: string;
    readonly luParClient?: boolean;
    readonly luParAdmin?: boolean;
    readonly lastUpdated?: string;
}
export interface RequeteMessageContact {
    readonly nomPrenom: string;
    readonly entreprise?: string;
    readonly telephone: string;
    readonly email: string;
    readonly objet: string;
    readonly message: string;
}

