package com.redtech.ticketflow.repository;
import com.redtech.ticketflow.entity.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findByTicketId(Long ticketId);
}


