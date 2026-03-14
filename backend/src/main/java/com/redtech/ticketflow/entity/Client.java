package com.redtech.ticketflow.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import java.util.List;
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "client")
public class Client extends Utilisateur {
    private String entreprise;
    private String telephone;
    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Projet> projets;
    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Ticket> tickets;
}


