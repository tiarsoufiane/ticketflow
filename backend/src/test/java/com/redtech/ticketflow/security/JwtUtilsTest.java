package com.redtech.ticketflow.security;
import com.redtech.ticketflow.security.service.UserDetailsImpl;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.Collections;
import static org.assertj.core.api.Assertions.assertThat;
@DisplayName("Tests de JwtUtils")
class JwtUtilsTest {
    private JwtUtils jwtUtils;
    private String secretKey = "dGVzdFNlY3JldEtleUZvckpXVFRlc3RpbmdQdXJwb3Nlc09ubHlUaGlzSXNBVmVyeUxvbmdTZWNyZXRLZXk=";
    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "cleSecrete", secretKey);
        ReflectionTestUtils.setField(jwtUtils, "dureeExpirationMs", 86400000);
    }
    @Test
    @DisplayName("Devrait générer un token JWT valide")
    void devraitGenererTokenValide() {
        UserDetailsImpl userDetails = UserDetailsImpl.build(creerUtilisateurTest());
        Authentication auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        String token = jwtUtils.genererTokenJwt(auth);
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }
    @Test
    @DisplayName("Devrait extraire le nom d'utilisateur du token")
    void devraitExtraireNomUtilisateur() {
        UserDetailsImpl userDetails = UserDetailsImpl.build(creerUtilisateurTest());
        Authentication auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        String token = jwtUtils.genererTokenJwt(auth);
        String username = jwtUtils.extraireNomUtilisateur(token);
        assertThat(username).isEqualTo("test@example.com");
    }
    @Test
    @DisplayName("Devrait valider un token valide")
    void devraitValiderTokenValide() {
        UserDetailsImpl userDetails = UserDetailsImpl.build(creerUtilisateurTest());
        Authentication auth = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        String token = jwtUtils.genererTokenJwt(auth);
        boolean isValid = jwtUtils.validerTokenJwt(token);
        assertThat(isValid).isTrue();
    }
    @Test
    @DisplayName("Devrait rejeter un token invalide")
    void devraitRejeterTokenInvalide() {
        String tokenInvalide = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";
        boolean isValid = jwtUtils.validerTokenJwt(tokenInvalide);
        assertThat(isValid).isFalse();
    }
    private com.redtech.ticketflow.entity.Client creerUtilisateurTest() {
        com.redtech.ticketflow.entity.Client client = new com.redtech.ticketflow.entity.Client();
        client.setId(1L);
        client.setEmail("test@example.com");
        client.setMotDePasse("password");
        client.setNom("Test");
        client.setPrenom("User");
        client.setActif(true);
        return client;
    }
}


