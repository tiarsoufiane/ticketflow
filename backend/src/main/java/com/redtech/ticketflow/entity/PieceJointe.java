package com.redtech.ticketflow.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
public class PieceJointe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomFichier;
    private String cheminFichier;
    private Long tailleFichier;
    private String typeMime;
    private LocalDateTime dateUpload;
    @ManyToOne
    @JoinColumn(name = "ticket_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Ticket ticket;
}


