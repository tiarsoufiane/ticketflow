package com.redtech.ticketflow.repository;
import com.redtech.ticketflow.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);
}


