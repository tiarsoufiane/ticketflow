package com.redtech.ticketflow.dto.request;
import jakarta.validation.constraints.*;
public record RequeteMessageContact(
        @NotBlank(message = "Le nom et prénom est obligatoire")
        @Size(max = 20, message = "Le nom et prénom ne doit pas dépasser 20 caractères")
        String nomPrenom,
        @Size(max = 20, message = "Le nom de l'entreprise ne doit pas dépasser 20 caractères")
        String entreprise,
        @NotBlank(message = "Le numéro de téléphone est obligatoire")
        @Pattern(regexp = "^[0-9]{10}$", message = "Le numéro de téléphone doit contenir exactement 10 chiffres")
        String telephone,
        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Format d'email invalide")
        String email,
        @NotBlank(message = "L'objet de la demande est obligatoire")
        @Size(max = 25, message = "L'objet ne doit pas dépasser 25 caractères")
        String objet,
        @NotBlank(message = "Le message est obligatoire")
        @Size(max = 500, message = "Le message ne doit pas dépasser 500 caractères")
        String message
) {
}


