package com.redtech.ticketflow.repository;
import com.redtech.ticketflow.entity.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {
    Optional<Administrateur> findByEmail(String email);
}


