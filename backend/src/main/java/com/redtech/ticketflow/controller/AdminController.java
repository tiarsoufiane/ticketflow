package com.redtech.ticketflow.controller;
import com.redtech.ticketflow.dto.request.SignupRequest;
import com.redtech.ticketflow.entity.Client;
import com.redtech.ticketflow.entity.Technicien;
import com.redtech.ticketflow.entity.Utilisateur;
import com.redtech.ticketflow.entity.enums.Role;
import com.redtech.ticketflow.repository.ClientRepository;
import com.redtech.ticketflow.repository.ProjetRepository;
import com.redtech.ticketflow.repository.TechnicienRepository;
import com.redtech.ticketflow.repository.TicketRepository;
import com.redtech.ticketflow.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    UtilisateurRepository utilisateurRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    TechnicienRepository technicienRepository;
    @Autowired
    ProjetRepository projetRepository;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @GetMapping("/users/pending")
    public List<Utilisateur> getPendingUsers() {
        return utilisateurRepository.findByActifFalse();
    }
    @PutMapping("/users/{id}/validate")
    public ResponseEntity<?> validateUser(@PathVariable @NonNull Long id) {
        return utilisateurRepository.findById(id)
                .map(utilisateur -> {
                    utilisateur.setActif(true);
                    utilisateurRepository.save(utilisateur);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Utilisateur activé avec succès !");
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/clients")
    public List<Client> getClients() {
        return clientRepository.findAll();
    }
    @GetMapping("/techniciens")
    public List<Technicien> getTechniciens() {
        return technicienRepository.findAll();
    }
    @PostMapping("/clients")
    public ResponseEntity<?> createClient(@RequestBody SignupRequest signUpRequest) {
        if (utilisateurRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Erreur: Email déjà utilisé !");
        }
        Client user = new Client();
        user.setNom(signUpRequest.getNom());
        user.setPrenom(signUpRequest.getPrenom());
        user.setEmail(signUpRequest.getEmail());
        user.setMotDePasse(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(Role.CLIENT);
        user.setEntreprise(signUpRequest.getEntreprise());
        user.setTelephone(signUpRequest.getTelephone());
        user.setActif(true);
        clientRepository.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Client créé avec succès !");
        return ResponseEntity.ok(response);
    }
    @PostMapping("/techniciens")
    public ResponseEntity<?> createTechnicien(@RequestBody SignupRequest signUpRequest) {
        if (utilisateurRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Erreur: Email déjà utilisé !");
        }
        Technicien user = new Technicien();
        user.setNom(signUpRequest.getNom());
        user.setPrenom(signUpRequest.getPrenom());
        user.setEmail(signUpRequest.getEmail());
        user.setMotDePasse(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(Role.TECHNICIEN);
        user.setSpecialite(signUpRequest.getSpecialite());
        user.setActif(true);
        technicienRepository.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Technicien créé avec succès !");
        return ResponseEntity.ok(response);
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<Utilisateur> getUser(@PathVariable @NonNull Long id) {
        return utilisateurRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable @NonNull Long id,
            @RequestBody SignupRequest request) {
        return utilisateurRepository.findById(id).map(user -> {
            user.setNom(request.getNom());
            user.setPrenom(request.getPrenom());
            user.setEmail(request.getEmail());
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setMotDePasse(passwordEncoder.encode(request.getPassword()));
            }
            if (user instanceof Client client) {
                client.setEntreprise(request.getEntreprise());
                client.setTelephone(request.getTelephone());
                clientRepository.save(client);
            } else if (user instanceof Technicien tech) {
                tech.setSpecialite(request.getSpecialite());
                technicienRepository.save(tech);
            } else {
                utilisateurRepository.save(user);
            }
            Map<String, String> response = new HashMap<>();
            response.put("message", "Utilisateur mis à jour avec succès !");
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable @NonNull Long id) {
        if (utilisateurRepository.existsById(id)) {
            utilisateurRepository.deleteById(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Utilisateur supprimé avec succès !");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", utilisateurRepository.count());
        stats.put("totalClients", clientRepository.count());
        stats.put("totalTechniciens", technicienRepository.count());
        stats.put("totalProjets", projetRepository.count());
        stats.put("totalTickets", ticketRepository.count());
        return ResponseEntity.ok(stats);
    }
}


