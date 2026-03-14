package com.redtech.ticketflow.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
public record ProjetRequest(
    @NotBlank(message = "Le nom du projet est obligatoire")
    @Size(min = 3, max = 100, message = "Le nom doit contenir entre 3 et 100 caractères")
    String nom,
    @NotBlank(message = "La description est obligatoire")
    String description,
    @NotNull(message = "La date de début est obligatoire")
    LocalDate dateDebut,
    @NotNull(message = "La date de livraison est obligatoire")
    LocalDate dateLivraison,
    @NotNull(message = "Le client est obligatoire")
    Long clientId
) {
}


