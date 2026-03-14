package com.redtech.ticketflow.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public record CommentaireRequest(
    @NotBlank(message = "Le contenu est obligatoire")
    String contenu,
    @NotNull(message = "Le ticket est obligatoire")
    Long ticketId
) {
}


