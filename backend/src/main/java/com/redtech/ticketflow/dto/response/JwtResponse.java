package com.redtech.ticketflow.dto.response;
import lombok.Data;
import java.util.List;
@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String role;
    private String nom;
    private String prenom;
    private String entreprise;
    private String telephone;
    public JwtResponse(String accessToken, Long id, String email, String role, String nom, String prenom) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.role = role;
        this.nom = nom;
        this.prenom = prenom;
    }
    public JwtResponse(String accessToken, Long id, String email, String role, String nom, String prenom,
            String entreprise, String telephone) {
        this(accessToken, id, email, role, nom, prenom);
        this.entreprise = entreprise;
        this.telephone = telephone;
    }
}


