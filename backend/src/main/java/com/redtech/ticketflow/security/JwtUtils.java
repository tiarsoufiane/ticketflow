package com.redtech.ticketflow.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    @Value("${application.security.jwt.secret-key}")
    private String cleSecrete;
    @Value("${application.security.jwt.expiration}")
    private int dureeExpirationMs;
    public String genererTokenJwt(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject((userPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + dureeExpirationMs))
                .signWith(obtenirCle(), SignatureAlgorithm.HS256)
                .compact();
    }
    private Key obtenirCle() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(cleSecrete));
    }
    public String extraireNomUtilisateur(String token) {
        return Jwts.parserBuilder().setSigningKey(obtenirCle()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
    public boolean validerTokenJwt(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(obtenirCle()).build().parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Token JWT invalide: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Token JWT expiré: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Token JWT non supporté: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("La chaîne claims JWT est vide: {}", e.getMessage());
        }
        return false;
    }
}


