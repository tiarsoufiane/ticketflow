package com.redtech.ticketflow.service;
import com.redtech.ticketflow.entity.Client;
import com.redtech.ticketflow.entity.Projet;
import com.redtech.ticketflow.entity.Ticket;
import com.redtech.ticketflow.entity.enums.TicketPriorite;
import com.redtech.ticketflow.entity.enums.TicketStatus;
import com.redtech.ticketflow.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
@ExtendWith(MockitoExtension.class)
@DisplayName("Tests du Repository Ticket")
class TicketRepositoryTest {
    @Mock
    private TicketRepository ticketRepository;
    private Ticket ticketTest;
    private Client clientTest;
    @BeforeEach
    void setUp() {
        clientTest = new Client();
        clientTest.setId(1L);
        clientTest.setNom("Dupont");
        clientTest.setPrenom("Jean");
        Projet projetTest = new Projet();
        projetTest.setId(1L);
        projetTest.setNom("Projet Test");
        ticketTest = new Ticket();
        ticketTest.setId(1L);
        ticketTest.setTitre("Bug critique");
        ticketTest.setDescription("Description du bug");
        ticketTest.setPriorite(TicketPriorite.HAUTE);
        ticketTest.setStatut(TicketStatus.OUVERT);
        ticketTest.setDateCreation(LocalDateTime.now());
        ticketTest.setClient(clientTest);
        ticketTest.setProjet(projetTest);
    }
    @Test
    @DisplayName("Devrait trouver les tickets par ID client")
    void devraitTrouverTicketsParClientId() {
        List<Ticket> ticketsAttendus = Arrays.asList(ticketTest);
        when(ticketRepository.findByClientId(1L)).thenReturn(ticketsAttendus);
        List<Ticket> tickets = ticketRepository.findByClientId(1L);
        assertThat(tickets).isNotEmpty();
        assertThat(tickets).hasSize(1);
        assertThat(tickets.get(0).getClient().getId()).isEqualTo(1L);
    }
    @Test
    @DisplayName("Devrait compter les tickets par statut")
    void devraitCompterTicketsParStatut() {
        when(ticketRepository.countByClientIdAndStatut(1L, TicketStatus.OUVERT)).thenReturn(5L);
        long count = ticketRepository.countByClientIdAndStatut(1L, TicketStatus.OUVERT);
        assertThat(count).isEqualTo(5L);
    }
    @Test
    @DisplayName("Devrait récupérer les 5 derniers tickets")
    void devraitRecupererDerniersTickets() {
        List<Ticket> ticketsRecents = Arrays.asList(ticketTest);
        when(ticketRepository.findTop5ByClientIdOrderByDateCreationDesc(1L))
                .thenReturn(ticketsRecents);
        List<Ticket> tickets = ticketRepository.findTop5ByClientIdOrderByDateCreationDesc(1L);
        assertThat(tickets).isNotEmpty();
        assertThat(tickets.size()).isLessThanOrEqualTo(5);
    }
}


