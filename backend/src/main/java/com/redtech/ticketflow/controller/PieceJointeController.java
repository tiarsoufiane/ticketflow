package com.redtech.ticketflow.controller;
import com.redtech.ticketflow.entity.PieceJointe;
import com.redtech.ticketflow.entity.Ticket;
import com.redtech.ticketflow.repository.PieceJointeRepository;
import com.redtech.ticketflow.repository.TicketRepository;
import com.redtech.ticketflow.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/pieces-jointes")
@RequiredArgsConstructor
public class PieceJointeController {
    private final PieceJointeRepository pieceJointeRepository;
    private final TicketRepository ticketRepository;
    private final FileStorageService fileStorageService;
    @PostMapping("/upload/{ticketId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> televerserFichiers(@PathVariable Long ticketId,
            @RequestParam("files") MultipartFile[] files) {
        try {
            Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
            if (!ticketOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Ticket introuvable !");
            }
            int currentCount = pieceJointeRepository.countByTicketId(ticketId);
            if (currentCount + files.length > 5) {
                return ResponseEntity.badRequest()
                        .body("Maximum 5 pièces jointes autorisées par ticket. Actuellement: " + currentCount);
            }
            List<PieceJointe> uploadedFiles = new ArrayList<>();
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }
                String filename = fileStorageService.stockerFichier(file, ticketId);
                PieceJointe pieceJointe = new PieceJointe();
                pieceJointe.setNomFichier(file.getOriginalFilename());
                pieceJointe.setCheminFichier(filename);
                pieceJointe.setTailleFichier(file.getSize());
                pieceJointe.setTypeMime(file.getContentType());
                pieceJointe.setDateUpload(LocalDateTime.now());
                pieceJointe.setTicket(ticketOpt.get());
                uploadedFiles.add(pieceJointeRepository.save(pieceJointe));
            }
            return ResponseEntity.ok(uploadedFiles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'upload: " + e.getMessage());
        }
    }
    @GetMapping("/ticket/{ticketId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<?> obtenirPiecesJointesParTicket(@PathVariable Long ticketId) {
        List<PieceJointe> attachments = pieceJointeRepository.findByTicketId(ticketId);
        return ResponseEntity.ok(attachments);
    }
    @GetMapping("/download/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('TECHNICIEN') or hasRole('ADMIN')")
    public ResponseEntity<Resource> telechargerFichier(@PathVariable Long id) {
        try {
            Optional<PieceJointe> pieceJointeOpt = pieceJointeRepository.findById(id);
            if (!pieceJointeOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            PieceJointe pieceJointe = pieceJointeOpt.get();
            Resource resource = new UrlResource(fileStorageService.chargerFichier(pieceJointe.getCheminFichier()).toUri());
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(pieceJointe.getTypeMime()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + pieceJointe.getNomFichier() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> supprimerPieceJointe(@PathVariable Long id) {
        try {
            Optional<PieceJointe> pieceJointeOpt = pieceJointeRepository.findById(id);
            if (!pieceJointeOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            PieceJointe pieceJointe = pieceJointeOpt.get();
            fileStorageService.supprimerFichier(pieceJointe.getCheminFichier());
            pieceJointeRepository.delete(pieceJointe);
            return ResponseEntity.ok("Pièce jointe supprimée avec succès");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la suppression: " + e.getMessage());
        }
    }
}


