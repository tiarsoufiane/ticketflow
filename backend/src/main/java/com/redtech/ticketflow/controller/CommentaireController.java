package com.redtech.ticketflow.controller;
import com.redtech.ticketflow.dto.request.CommentaireRequest;
import com.redtech.ticketflow.entity.Commentaire;
import com.redtech.ticketflow.entity.Ticket;
import com.redtech.ticketflow.entity.Utilisateur;
import com.redtech.ticketflow.repository.CommentaireRepository;
import com.redtech.ticketflow.repository.TicketRepository;
import com.redtech.ticketflow.repository.UtilisateurRepository;
import com.redtech.ticketflow.security.service.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/commentaires")
@RequiredArgsConstructor
public class CommentaireController {
    private final CommentaireRepository commentaireRepository;
    private final TicketRepository ticketRepository;
    private final UtilisateurRepository utilisateurRepository;
    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> obtenirCommentairesParTicket(@PathVariable Long ticketId, Authentication authentication) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (!ticketOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Ticket introuvable !");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Ticket ticket = ticketOpt.get();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .anyMatch(auth -> auth != null && auth.contains("ADMIN"));
        boolean isClientOwner = ticket.getClient().getId().equals(userDetails.getId());
        boolean isTechAssigned = ticket.getTechnicien() != null
                && ticket.getTechnicien().getId().equals(userDetails.getId());
        boolean isTechnicien = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICIEN"));
        if (!isAdmin && !isTechnicien && !isClientOwner) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body("Accès non autorisé à ce ticket");
        }
        List<Commentaire> comments = commentaireRepository.findByTicketId(ticketId);
        List<com.redtech.ticketflow.dto.response.CommentaireResponse> response = comments.stream()
                .map(c -> {
                    com.redtech.ticketflow.dto.response.CommentaireResponse dto = new com.redtech.ticketflow.dto.response.CommentaireResponse();
                    dto.setId(c.getId());
                    dto.setContenu(c.getContenu());
                    dto.setDateCommentaire(c.getDateCommentaire());
                    if (c.getAuteur() != null) {
                        com.redtech.ticketflow.dto.response.CommentaireResponse.AuteurInfo auteurInfo = new com.redtech.ticketflow.dto.response.CommentaireResponse.AuteurInfo();
                        auteurInfo.setId(c.getAuteur().getId());
                        auteurInfo.setNom(c.getAuteur().getNom());
                        auteurInfo.setPrenom(c.getAuteur().getPrenom());
                        auteurInfo.setRole(c.getAuteur().getRole());
                        dto.setAuteur(auteurInfo);
                    }
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(response);
    }
    @PostMapping("/create")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> creerCommentaire(@RequestBody CommentaireRequest commentaireRequest,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Ticket> ticketOpt = ticketRepository.findById(commentaireRequest.ticketId());
        if (!ticketOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Ticket introuvable !");
        }
        Ticket ticket = ticketOpt.get();
        boolean isAdmin = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .anyMatch(auth -> auth != null && auth.contains("ADMIN"));
        boolean isClientOwner = ticket.getClient().getId().equals(userDetails.getId());
        boolean isTechAssigned = ticket.getTechnicien() != null
                && ticket.getTechnicien().getId().equals(userDetails.getId());
        boolean isTechnicien = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICIEN"));
        if (!isAdmin && !isTechnicien && !isClientOwner) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body("Vous n'êtes pas autorisé à commenter ce ticket");
        }
        Optional<Utilisateur> auteurOpt = utilisateurRepository.findById(userDetails.getId());
        if (!auteurOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Utilisateur introuvable !");
        }
        Commentaire commentaire = new Commentaire();
        commentaire.setContenu(commentaireRequest.contenu());
        commentaire.setDateCommentaire(LocalDateTime.now());
        commentaire.setTicket(ticket);
        commentaire.setAuteur(auteurOpt.get());
        Commentaire savedCommentaire = commentaireRepository.save(commentaire);
        return ResponseEntity.ok(savedCommentaire);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> modifierCommentaire(@PathVariable Long id,
            @RequestBody CommentaireRequest commentaireRequest,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Commentaire> commentaireOpt = commentaireRepository.findById(id);
        if (!commentaireOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Commentaire introuvable !");
        }
        Commentaire commentaire = commentaireOpt.get();
        if (!commentaire.getAuteur().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body("Vous n'êtes pas autorisé à modifier ce commentaire");
        }
        if (commentaireRequest.contenu() != null && !commentaireRequest.contenu().trim().isEmpty()) {
            commentaire.setContenu(commentaireRequest.contenu());
            Commentaire updatedCommentaire = commentaireRepository.save(commentaire);
            return ResponseEntity.ok(updatedCommentaire);
        } else {
            return ResponseEntity.badRequest().body("Le contenu ne peut pas être vide");
        }
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> supprimerCommentaire(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Optional<Commentaire> commentaireOpt = commentaireRepository.findById(id);
        if (!commentaireOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Commentaire introuvable !");
        }
        Commentaire commentaire = commentaireOpt.get();
        if (!commentaire.getAuteur().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN)
                    .body("Vous n'êtes pas autorisé à supprimer ce commentaire");
        }
        commentaireRepository.delete(commentaire);
        return ResponseEntity.ok("Commentaire supprimé avec succès");
    }
}


