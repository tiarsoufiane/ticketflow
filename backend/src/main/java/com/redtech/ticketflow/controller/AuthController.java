package com.redtech.ticketflow.controller;
import com.redtech.ticketflow.dto.request.LoginRequest;
import com.redtech.ticketflow.dto.request.SignupRequest;
import com.redtech.ticketflow.dto.response.JwtResponse;
import com.redtech.ticketflow.dto.response.MessageResponse;
import com.redtech.ticketflow.entity.Administrateur;
import com.redtech.ticketflow.entity.Client;
import com.redtech.ticketflow.entity.Technicien;
import com.redtech.ticketflow.entity.enums.Role;
import com.redtech.ticketflow.repository.AdministrateurRepository;
import com.redtech.ticketflow.repository.ClientRepository;
import com.redtech.ticketflow.repository.TechnicienRepository;
import com.redtech.ticketflow.security.JwtUtils;
import com.redtech.ticketflow.security.service.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    TechnicienRepository technicienRepository;
    @Autowired
    AdministrateurRepository administrateurRepository;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    JwtUtils jwtUtils;
    @Operation(summary = "Connexion", description = "Authentifie un utilisateur et retourne un token JWT")
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.genererTokenJwt(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            if (!userDetails.isEnabled()) {
                return ResponseEntity.badRequest().body(
                        new MessageResponse("Votre compte n'est pas encore activé par l'administrateur."));
            }
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(item -> item.getAuthority().replace("ROLE_", ""))
                    .orElse("CLIENT");
            if ("CLIENT".equals(role)) {
                Client client = clientRepository.findByEmail(userDetails.getEmail()).orElse(null);
                String entreprise = client != null ? client.getEntreprise() : null;
                String telephone = client != null ? client.getTelephone() : null;
                return ResponseEntity.ok(new JwtResponse(jwt,
                        userDetails.getId(),
                        userDetails.getEmail(),
                        role,
                        userDetails.getNom(),
                        userDetails.getPrenom(),
                        entreprise,
                        telephone));
            }
            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getEmail(),
                    role,
                    userDetails.getNom(),
                    userDetails.getPrenom()));
        } catch (DisabledException ex) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Votre compte n'est pas encore activé par l'administrateur."));
        }
    }
    @Operation(summary = "Inscription", description = "Crée un nouveau compte utilisateur (Client ou Technicien)")
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (clientRepository.findByEmail(signUpRequest.getEmail()).isPresent() ||
            technicienRepository.findByEmail(signUpRequest.getEmail()).isPresent() ||
            administrateurRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Erreur: Cet email est déjà utilisé !"));
        }
        if (signUpRequest.getEmail() == null || !signUpRequest.getEmail().endsWith("@ticketflow.com")) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Erreur: L'email doit se terminer par @ticketflow.com !"));
        }
        String strRole = signUpRequest.getRole();
        if ("admin".equalsIgnoreCase(strRole)) {
            Administrateur user = new Administrateur();
            user.setNom(signUpRequest.getNom());
            user.setPrenom(signUpRequest.getPrenom());
            user.setEmail(signUpRequest.getEmail());
            user.setMotDePasse(encoder.encode(signUpRequest.getPassword()));
            user.setRole(Role.ADMIN);
            user.setNiveau("SUPER_ADMIN");
            user.setActif(true);
            administrateurRepository.save(user);
        } else if ("tech".equalsIgnoreCase(strRole) || "TECHNICIEN".equalsIgnoreCase(strRole)) {
            Technicien user = new Technicien();
            user.setNom(signUpRequest.getNom());
            user.setPrenom(signUpRequest.getPrenom());
            user.setEmail(signUpRequest.getEmail());
            user.setMotDePasse(encoder.encode(signUpRequest.getPassword()));
            user.setRole(Role.TECHNICIEN);
            user.setSpecialite(signUpRequest.getSpecialite());
            user.setActif(false);
            technicienRepository.save(user);
        } else if ("client".equalsIgnoreCase(strRole) || "CLIENT".equalsIgnoreCase(strRole) || strRole == null) {
            Client user = new Client();
            user.setNom(signUpRequest.getNom());
            user.setPrenom(signUpRequest.getPrenom());
            user.setEmail(signUpRequest.getEmail());
            user.setMotDePasse(encoder.encode(signUpRequest.getPassword()));
            user.setRole(Role.CLIENT);
            user.setEntreprise(signUpRequest.getEntreprise());
            user.setTelephone(signUpRequest.getTelephone());
            user.setActif(false);
            clientRepository.save(user);
        } else {
            return ResponseEntity.badRequest().body(new MessageResponse("Erreur: Rôle invalide !"));
        }
        return ResponseEntity
                .ok(new MessageResponse("Utilisateur enregistré avec succès ! En attente de validation par l'admin."));
    }
}


