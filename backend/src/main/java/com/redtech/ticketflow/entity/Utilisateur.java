package com.redtech.ticketflow.entity;
import com.redtech.ticketflow.entity.enums.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    protected String nom;
    protected String prenom;
    @Column(unique = true, nullable = false)
    protected String email;
    @JsonProperty("password")
    @Column(name = "password")
    protected String motDePasse;
    @Enumerated(EnumType.STRING)
    protected Role role;
    @JsonProperty("active")
    @Column(name = "active")
    protected boolean actif = false;
}


