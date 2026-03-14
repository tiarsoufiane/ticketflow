package com.redtech.ticketflow.security.service;
import com.redtech.ticketflow.entity.Administrateur;
import com.redtech.ticketflow.entity.Client;
import com.redtech.ticketflow.entity.Technicien;
import com.redtech.ticketflow.repository.AdministrateurRepository;
import com.redtech.ticketflow.repository.ClientRepository;
import com.redtech.ticketflow.repository.TechnicienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    TechnicienRepository technicienRepository;
    @Autowired
    AdministrateurRepository administrateurRepository;
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Client> client = clientRepository.findByEmail(email);
        if (client.isPresent()) {
            return UserDetailsImpl.build(client.get());
        }
        Optional<Technicien> technicien = technicienRepository.findByEmail(email);
        if (technicien.isPresent()) {
            return UserDetailsImpl.build(technicien.get());
        }
        Optional<Administrateur> administrateur = administrateurRepository.findByEmail(email);
        if (administrateur.isPresent()) {
            return UserDetailsImpl.build(administrateur.get());
        }
        throw new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email);
    }
}


