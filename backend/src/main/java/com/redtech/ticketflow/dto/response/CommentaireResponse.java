package com.redtech.ticketflow.dto.response;
import com.redtech.ticketflow.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentaireResponse {
    private Long id;
    private String contenu;
    private LocalDateTime dateCommentaire;
    private AuteurInfo auteur;
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuteurInfo {
        private Long id;
        private String nom;
        private String prenom;
        private Role role;
    }
}


