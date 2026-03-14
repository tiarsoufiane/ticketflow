package com.redtech.ticketflow.exception;
public class RessourceIntrouvableException extends RuntimeException {
    public RessourceIntrouvableException(String message) {
        super(message);
    }
    public RessourceIntrouvableException(String ressource, Long id) {
        super(String.format("%s avec l'ID %d introuvable", ressource, id));
    }
}


