package com.redtech.ticketflow.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "technicien")
public class Technicien extends Utilisateur {
    private String specialite;
    private boolean disponible = true;
    @OneToMany(mappedBy = "technicien")
    @JsonIgnore
    private List<Ticket> tickets;
}


