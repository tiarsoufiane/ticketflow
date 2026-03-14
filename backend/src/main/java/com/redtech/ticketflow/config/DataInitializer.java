package com.redtech.ticketflow.config;

import com.redtech.ticketflow.entity.*;
import com.redtech.ticketflow.entity.enums.*;
import com.redtech.ticketflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    AdministrateurRepository administrateurRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    TechnicienRepository technicienRepository;
    @Autowired
    ProjetRepository projetRepository;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (administrateurRepository.count() == 0) {
            System.out.println("Initialisation des données de test...");
            Administrateur admin = new Administrateur();
            admin.setNom("Admin");
            admin.setPrenom("Principal");
            admin.setEmail("admin@ticketflow.com");
            admin.setMotDePasse(encoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setNiveau("SUPER_ADMIN");
            admin.setActif(true);
            administrateurRepository.save(admin);
            System.out.println("Données de test initialisées (Admin uniquement) !");
        }
    }
}
