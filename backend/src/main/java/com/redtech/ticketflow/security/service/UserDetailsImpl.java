package com.redtech.ticketflow.security.service;
import com.redtech.ticketflow.entity.Utilisateur;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;
    private Long id;
    private String username;
    private String email;
    @JsonIgnore
    private String password;
    private boolean active;
    private Collection<? extends GrantedAuthority> authorities;
    private String nom;
    private String prenom;
    public UserDetailsImpl(Long id, String email, String password, boolean active, String nom, String prenom,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = email;
        this.email = email;
        this.password = password;
        this.active = active;
        this.nom = nom;
        this.prenom = prenom;
        this.authorities = authorities;
    }
    public static UserDetailsImpl build(Utilisateur user) {
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getMotDePasse(),
                user.isActif(),
                user.getNom(),
                user.getPrenom(),
                authorities);
    }
    public String getNom() {
        return nom;
    }
    public String getPrenom() {
        return prenom;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    public Long getId() {
        return id;
    }
    public String getEmail() {
        return email;
    }
    @Override
    public String getPassword() {
        return password;
    }
    @Override
    public String getUsername() {
        return username;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return active;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}


