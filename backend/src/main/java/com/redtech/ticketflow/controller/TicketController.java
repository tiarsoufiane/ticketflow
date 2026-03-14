package com.redtech.ticketflow.controller;
import com.redtech.ticketflow.dto.request.TicketRequest;
import com.redtech.ticketflow.entity.Client;
import com.redtech.ticketflow.entity.Projet;
import com.redtech.ticketflow.entity.Technicien;
import com.redtech.ticketflow.entity.Ticket;
import com.redtech.ticketflow.entity.enums.TicketStatus;
import com.redtech.ticketflow.repository.ClientRepository;
import com.redtech.ticketflow.repository.ProjetRepository;
import com.redtech.ticketflow.repository.TechnicienRepository;
import com.redtech.ticketflow.repository.TicketRepository;
import com.redtech.ticketflow.security.service.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tickets")
@Tag(name = "Tickets", description = "API de gestion des tickets de support")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class TicketController {
    private final TicketRepository ticketRepository;
    private final ClientRepository clientRepository;
    private final TechnicienRepository technicienRepository;
    private final ProjetRepository projetRepository;
    @Operation(summary = "Récupérer tous les tickets", description = "Accessible uniquement par les administrateurs")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }
    @GetMapping("/client/stats")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> getClientStats(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Long clientId = userDetails.getId();
            Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalTickets", ticketRepository.countByClientId(clientId));
            stats.put("ouvert", ticketRepository.countByClientIdAndStatut(clientId, TicketStatus.OUVERT));
            stats.put("enCours", ticketRepository.countByClientIdAndStatut(clientId, TicketStatus.EN_COURS));
            stats.put("resolu", ticketRepository.countByClientIdAndStatut(clientId, TicketStatus.RESOLU));
            stats.put("ferme", ticketRepository.countByClientIdAndStatut(clientId, TicketStatus.FERME));
            List<Projet> projets = projetRepository.findByClientId(clientId);
            List<Map<String, Object>> projetsStats = projets.stream().map(p -> {
                Map<String, Object> pMap = new java.util.HashMap<>();
                pMap.put("id", p.getId());
                pMap.put("nom", p.getNom());
                long count = ticketRepository.findAll().stream().filter(t -> t.getProjet().getId().equals(p.getId()))
                        .count();
                pMap.put("ticketCount", count);
                return pMap;
            }).toList();
            stats.put("projets", projetsStats);
            stats.put("latestTickets", ticketRepository.findTop5ByClientIdOrderByDateCreationDesc(clientId));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur lors du calcul des statistiques"));
        }
    }
    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public List<Ticket> getClientTickets(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ticketRepository.findByClientId(userDetails.getId());
    }
    @GetMapping("/tech")
    @PreAuthorize("hasRole('TECHNICIEN')")
    public List<Ticket> getTechTickets(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ticketRepository.findByTechnicienId(userDetails.getId());
    }
    @GetMapping("/tech/all")
    @PreAuthorize("hasRole('TECHNICIEN')")
    public List<Ticket> getAllTicketsForTech() {
        return ticketRepository.findAll();
    }
    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public List<Ticket> getProjectTickets(@PathVariable Long projectId) {
        return ticketRepository.findByProjetId(projectId);
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> getTicketById(@PathVariable Long id) {
        Optional<Ticket> ticket = ticketRepository.findById(id);
        if (ticket.isPresent()) {
            return ResponseEntity.ok(ticket.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @Operation(summary = "Créer un ticket", description = "Permet à un client de créer un ticket pour un projet")
    @PostMapping("/create")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> createTicket(@Valid @RequestBody TicketRequest ticketRequest, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Client> client = clientRepository.findById(userDetails.getId());
        Optional<Projet> projet = projetRepository.findById(ticketRequest.projetId());
        if (!client.isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Client introuvable"));
        if (!projet.isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Projet introuvable"));
        Ticket ticket = new Ticket();
        ticket.setTitre(ticketRequest.titre());
        ticket.setDescription(ticketRequest.description());
        ticket.setPriorite(ticketRequest.priorite());
        ticket.setStatut(TicketStatus.OUVERT);
        ticket.setDateCreation(LocalDateTime.now());
        ticket.setClient(client.get());
        ticket.setProjet(projet.get());
        Ticket savedTicket = ticketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Ticket créé avec succès !", "ticketId", savedTicket.getId()));
    }
    @PutMapping("/{id}/assign/{techId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignTicket(@PathVariable Long id, @PathVariable Long techId) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        Optional<Technicien> techOpt = technicienRepository.findById(techId);
        if (!ticketOpt.isPresent() || !techOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ticket ou Technicien introuvable"));
        }
        Ticket ticket = ticketOpt.get();
        ticket.setTechnicien(techOpt.get());
        ticket.setStatut(TicketStatus.EN_COURS);
        ticket.setDatePriseEnCharge(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Technicien assigné avec succès !", "ticket", savedTicket));
    }
    @PutMapping("/{id}/take-charge")
    @PreAuthorize("hasRole('TECHNICIEN')")
    public ResponseEntity<?> takeCharge(@PathVariable Long id, Authentication authentication) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (!ticketOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ticket introuvable"));
        }
        Ticket ticket = ticketOpt.get();
        if (ticket.getStatut() != TicketStatus.OUVERT) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Le ticket doit être OUVERT pour être pris en charge"));
        }
        if (ticket.getTechnicien() != null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ce ticket a déjà un technicien assigné"));
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Technicien> techOpt = technicienRepository.findById(userDetails.getId());
        if (!techOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Technicien introuvable"));
        }
        ticket.setTechnicien(techOpt.get());
        ticket.setStatut(TicketStatus.EN_COURS);
        ticket.setDatePriseEnCharge(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Ticket pris en charge avec succès !", "ticket", savedTicket));
    }
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('TECHNICIEN')")
    public ResponseEntity<?> resolveTicket(@PathVariable Long id, Authentication authentication) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (!ticketOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ticket introuvable"));
        }
        Ticket ticket = ticketOpt.get();
        if (ticket.getStatut() != TicketStatus.EN_COURS) {
            return ResponseEntity.badRequest().body(Map.of("error", "Le ticket doit être EN_COURS pour être résolu"));
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        if (ticket.getTechnicien() == null || !ticket.getTechnicien().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vous n'êtes pas assigné à ce ticket"));
        }
        ticket.setStatut(TicketStatus.RESOLU);
        ticket.setDateResolution(LocalDateTime.now());
        Ticket savedTicket = ticketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Ticket marqué comme résolu !", "ticket", savedTicket));
    }
    @PutMapping("/{id}/status/{status}")
    @PreAuthorize("hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @PathVariable String status,
            Authentication authentication) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (!ticketOpt.isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Ticket introuvable"));
        try {
            TicketStatus newStatus = TicketStatus.valueOf(status);
            Ticket ticket = ticketOpt.get();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            boolean isTech = userDetails.getAuthorities().stream()
                    .map(a -> a.getAuthority())
                    .anyMatch(auth -> auth != null && auth.contains("TECHNICIEN"));
            if (isTech) {
                if (ticket.getTechnicien() == null || !ticket.getTechnicien().getId().equals(userDetails.getId())) {
                    return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                            .body(Map.of("error", "Vous n'êtes pas autorisé à modifier le statut de ce ticket"));
                }
            }
            ticket.setStatut(newStatus);
            if (newStatus == TicketStatus.RESOLU || newStatus == TicketStatus.FERME) {
                ticket.setDateResolution(LocalDateTime.now());
            }
            Ticket savedTicket = ticketRepository.save(ticket);
            return ResponseEntity.ok(Map.of("message", "Statut mis à jour !", "ticket", savedTicket));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Statut invalide !"));
        }
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        System.out.println("DEBUG: Request to delete ticket with ID: " + id);
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (!ticketOpt.isPresent())
            return ResponseEntity.notFound().build();
        ticketRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Ticket supprimé avec succès !"));
    }
}


