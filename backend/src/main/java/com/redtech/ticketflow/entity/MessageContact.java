package com.redtech.ticketflow.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "message_contact")
public class MessageContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 20)
    private String nomPrenom;
    @Column(length = 20)
    private String entreprise;
    @Column(nullable = false, length = 10)
    private String telephone;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false, length = 25)
    private String objet;
    @Column(nullable = false, length = 500)
    private String message;
    private LocalDateTime dateEnvoi;
    private boolean lu = false;
    private Long clientId;
    @Column(length = 1000)
    private String reponse;
    private LocalDateTime dateReponse;
    @Column(length = 1000)
    private String reponseClient;
    private LocalDateTime dateReponseClient;
    private boolean luParClient = false;
    private boolean luParAdmin = true;
    private LocalDateTime lastUpdated;
    @PrePersist
    protected void onCreate() {
        dateEnvoi = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }
}


