package com.redtech.ticketflow.repository;
import com.redtech.ticketflow.entity.Ticket;
import com.redtech.ticketflow.entity.enums.TicketStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @EntityGraph(attributePaths = {"client", "projet", "technicien"})
    List<Ticket> findByClientId(Long clientId);
    @EntityGraph(attributePaths = {"client", "projet", "technicien"})
    List<Ticket> findByTechnicienId(Long technicienId);
    @EntityGraph(attributePaths = {"client", "projet", "technicien"})
    List<Ticket> findByProjetId(Long projetId);
    @EntityGraph(attributePaths = {"client", "projet", "technicien"})
    List<Ticket> findByStatut(TicketStatus statut);
    long countByClientId(Long clientId);
    long countByClientIdAndStatut(Long clientId, TicketStatus statut);
    @EntityGraph(attributePaths = {"client", "projet", "technicien"})
    List<Ticket> findTop5ByClientIdOrderByDateCreationDesc(Long clientId);
}


