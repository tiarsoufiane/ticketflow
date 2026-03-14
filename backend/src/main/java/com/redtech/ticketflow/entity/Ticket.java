package com.redtech.ticketflow.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.redtech.ticketflow.entity.enums.TicketPriorite;
import com.redtech.ticketflow.entity.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
@Data
@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    private TicketStatus statut;
    @Enumerated(EnumType.STRING)
    private TicketPriorite priorite;
    private LocalDateTime dateCreation;
    private LocalDateTime datePriseEnCharge;
    private LocalDateTime dateResolution;
    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnore
    private Client client;
    @ManyToOne
    @JoinColumn(name = "projet_id")
    private Projet projet;
    @ManyToOne
    @JoinColumn(name = "technicien_id")
    private Technicien technicien;
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Commentaire> commentaires;
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<PieceJointe> piecesJointes;
}


