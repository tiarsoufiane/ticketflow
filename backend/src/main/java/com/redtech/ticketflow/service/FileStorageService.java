package com.redtech.ticketflow.service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
@Service
public class FileStorageService {
    private final Path emplacementStockage;
    public FileStorageService(@Value("${file.upload-dir:uploads/tickets}") String dossierTelechargement) {
        this.emplacementStockage = Paths.get(dossierTelechargement).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.emplacementStockage);
        } catch (Exception ex) {
            throw new RuntimeException("Impossible de créer le répertoire de téléversement!", ex);
        }
    }
    public String stockerFichier(MultipartFile fichier, Long ticketId) throws IOException {
        if (fichier.getSize() > 2 * 1024 * 1024) {
            throw new RuntimeException("La taille du fichier dépasse la limite maximale de 2 Mo");
        }
        String nomFichierOriginal = StringUtils.cleanPath(fichier.getOriginalFilename());
        String nomFichier = ticketId + "_" + System.currentTimeMillis() + "_" + nomFichierOriginal;
        Path emplacementCible = this.emplacementStockage.resolve(nomFichier);
        Files.copy(fichier.getInputStream(), emplacementCible, StandardCopyOption.REPLACE_EXISTING);
        return nomFichier;
    }
    public Path chargerFichier(String nomFichier) {
        return this.emplacementStockage.resolve(nomFichier).normalize();
    }
    public void supprimerFichier(String nomFichier) throws IOException {
        Path cheminFichier = this.emplacementStockage.resolve(nomFichier).normalize();
        Files.deleteIfExists(cheminFichier);
    }
}


