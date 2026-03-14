package com.redtech.ticketflow.controller;
import com.redtech.ticketflow.dto.request.RequeteMessageContact;
import com.redtech.ticketflow.dto.response.MessageResponse;
import com.redtech.ticketflow.entity.MessageContact;
import com.redtech.ticketflow.repository.DepotMessageContact;
import com.redtech.ticketflow.security.service.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class ControleurMessageContact {
    private final DepotMessageContact depotMessageContact;
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> envoyerMessage(
            @Valid @RequestBody RequeteMessageContact requete,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        MessageContact message = new MessageContact();
        message.setNomPrenom(requete.nomPrenom());
        message.setEntreprise(requete.entreprise());
        message.setTelephone(requete.telephone());
        message.setEmail(requete.email());
        message.setObjet(requete.objet());
        message.setMessage(requete.message());
        message.setClientId(userDetails.getId());
        depotMessageContact.save(message);
        return ResponseEntity.ok(new MessageResponse("Message envoyé avec succès!"));
    }
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MessageContact>> obtenirTousLesMessages() {
        List<MessageContact> messages = depotMessageContact.findAllByOrderByLastUpdatedDesc();
        return ResponseEntity.ok(messages);
    }
    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> obtenirNombreMessagesNonLus() {
        long totalCount = depotMessageContact.countByLuFalse();
        return ResponseEntity.ok(Map.of("count", totalCount));
    }
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> marquerCommeLu(@PathVariable Long id) {
        return depotMessageContact.findById(id)
                .map(message -> {
                    message.setLu(true);
                    message.setLuParAdmin(true);
                    depotMessageContact.save(message);
                    return ResponseEntity.ok(new MessageResponse("Message marqué comme lu"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> supprimerMessage(@PathVariable Long id) {
        if (depotMessageContact.existsById(id)) {
            depotMessageContact.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("Message supprimé"));
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/{id}/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> repondreAuMessage(@PathVariable Long id, @RequestBody Map<String, String> requete) {
        String reponse = requete.get("reponse");
        if (reponse == null || reponse.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("La réponse ne peut pas être vide"));
        }
        return depotMessageContact.findById(id)
                .map(message -> {
                    message.setReponse(reponse);
                    message.setDateReponse(LocalDateTime.now());
                    message.setLastUpdated(LocalDateTime.now());
                    message.setLu(true);
                    message.setLuParClient(false);
                    depotMessageContact.save(message);
                    return ResponseEntity.ok(message);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/my-messages")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<MessageContact>> obtenirMesMessages(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<MessageContact> messages = depotMessageContact
                .findByClientIdOrderByLastUpdatedDesc(userDetails.getId());
        return ResponseEntity.ok(messages);
    }
    @GetMapping("/my-messages/unread-count")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Map<String, Long>> obtenirMonNombreNonLus(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long count = depotMessageContact
                .countByClientIdAndReponseIsNotNullAndLuParClientFalse(userDetails.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }
    @PutMapping("/{id}/mark-read-by-client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> marquerCommeLuParClient(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return depotMessageContact.findById(id)
                .map(message -> {
                    if (!message.getClientId().equals(userDetails.getId())) {
                        return ResponseEntity.status(403).body(new MessageResponse("Accès refusé"));
                    }
                    message.setLuParClient(true);
                    depotMessageContact.save(message);
                    return ResponseEntity.ok(new MessageResponse("Message marqué comme lu"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}/client-reply")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> clientRepondAuMessage(@PathVariable Long id,
            @RequestBody Map<String, String> requete,
            Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String reponseClient = requete.get("reponseClient");
        if (reponseClient == null || reponseClient.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("La réponse ne peut pas être vide"));
        }
        return depotMessageContact.findById(id)
                .map(message -> {
                    if (!message.getClientId().equals(userDetails.getId())) {
                        return ResponseEntity.status(403).body(new MessageResponse("Accès refusé"));
                    }
                    message.setReponseClient(reponseClient);
                    message.setDateReponseClient(LocalDateTime.now());
                    message.setLastUpdated(LocalDateTime.now());
                    message.setLuParClient(true);
                    message.setLuParAdmin(false);
                    message.setLu(false);
                    depotMessageContact.save(message);
                    return ResponseEntity.ok(message);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}


