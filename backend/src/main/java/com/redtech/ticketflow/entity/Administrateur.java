package com.redtech.ticketflow.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "admin")
public class Administrateur extends Utilisateur {
    private String niveau;
}


