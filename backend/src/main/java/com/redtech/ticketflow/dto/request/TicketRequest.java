package com.redtech.ticketflow.dto.request;
import com.redtech.ticketflow.entity.enums.TicketPriorite;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
public record TicketRequest(
    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 5, max = 100, message = "Le titre doit contenir entre 5 et 100 caractères")
    String titre,
    @NotBlank(message = "La description est obligatoire")
    @Size(min = 10, message = "La description doit contenir au moins 10 caractères")
    String description,
    @NotNull(message = "La priorité est obligatoire")
    TicketPriorite priorite,
    @NotNull(message = "Le projet est obligatoire")
    Long projetId
) {
}


