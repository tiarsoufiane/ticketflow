package com.redtech.ticketflow.repository;
import com.redtech.ticketflow.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    List<Utilisateur> findByActifFalse();
    Boolean existsByEmail(String email);
}


