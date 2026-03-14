package com.redtech.ticketflow.repository;
import com.redtech.ticketflow.entity.Technicien;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface TechnicienRepository extends JpaRepository<Technicien, Long> {
    Optional<Technicien> findByEmail(String email);
    List<Technicien> findByDisponibleTrue();
}


