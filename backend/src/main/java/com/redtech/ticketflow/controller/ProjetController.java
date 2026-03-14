package com.redtech.ticketflow.controller;
import com.redtech.ticketflow.dto.request.ProjetRequest;
import com.redtech.ticketflow.entity.Client;
import com.redtech.ticketflow.entity.Projet;
import com.redtech.ticketflow.repository.ClientRepository;
import com.redtech.ticketflow.repository.ProjetRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/projets")
@RequiredArgsConstructor
public class ProjetController {
    private final ProjetRepository projetRepository;
    private final ClientRepository clientRepository;
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIEN')")
    public List<Projet> obtenirTousLesProjets() {
        List<Projet> projets = projetRepository.findAll();
        projets.forEach(p -> {
            if (p.getClient() != null) {
                p.getClient().getNom();
            }
        });
        return projets;
    }
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CLIENT')")
    public List<Projet> obtenirProjetsParClient(@PathVariable @NonNull Long clientId) {
        return projetRepository.findByClientId(clientId);
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TECHNICIEN') or hasRole('CLIENT')")
    public ResponseEntity<Projet> obtenirProjetParId(@PathVariable @NonNull Long id) {
        return projetRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> creerProjet(@Valid @RequestBody ProjetRequest projetRequest) {
        Optional<Client> client = clientRepository.findById(projetRequest.clientId());
        if (!client.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Client non trouvé !");
            return ResponseEntity.badRequest().body(error);
        }
        Projet projet = new Projet();
        projet.setNom(projetRequest.nom());
        projet.setDescription(projetRequest.description());
        projet.setDateDebut(projetRequest.dateDebut());
        projet.setDateLivraison(projetRequest.dateLivraison());
        projet.setStatut("EN_COURS");
        projet.setClient(client.get());
        projetRepository.save(projet);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Projet créé avec succès !");
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> modifierProjet(@PathVariable @NonNull Long id,
            @RequestBody ProjetRequest projetRequest) {
        return projetRepository.findById(id).map(projet -> {
            projet.setNom(projetRequest.nom());
            projet.setDescription(projetRequest.description());
            projet.setDateDebut(projetRequest.dateDebut());
            projet.setDateLivraison(projetRequest.dateLivraison());
            if (projetRequest.clientId() != null) {
                clientRepository.findById(projetRequest.clientId()).ifPresent(projet::setClient);
            }
            projetRepository.save(projet);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Projet mis à jour avec succès !");
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> supprimerProjet(@PathVariable @NonNull Long id) {
        if (projetRepository.existsById(id)) {
            projetRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Projet supprimé avec succès !");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
}


