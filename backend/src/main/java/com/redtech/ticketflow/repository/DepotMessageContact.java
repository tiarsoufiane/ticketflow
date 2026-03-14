package com.redtech.ticketflow.repository;
import com.redtech.ticketflow.entity.MessageContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface DepotMessageContact extends JpaRepository<MessageContact, Long> {
    long countByLuFalse();
    List<MessageContact> findAllByOrderByLastUpdatedDesc();
    List<MessageContact> findByClientIdOrderByLastUpdatedDesc(Long clientId);
    long countByClientIdAndReponseIsNotNullAndLuParClientFalse(Long clientId);
    long countByReponseClientIsNotNullAndLuParAdminFalse();
}


