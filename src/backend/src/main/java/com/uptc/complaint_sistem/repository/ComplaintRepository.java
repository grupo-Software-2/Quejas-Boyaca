package com.uptc.complaint_sistem.repository;

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByEntityAndDeletedFalse(PublicEntity entity);

    List<Complaint> findByDeletedFalse();

    Page<Complaint> findByDeletedFalse(Pageable pageable);

    Page<Complaint> findByEntityAndDeletedFalse(PublicEntity entity, Pageable pageable);
}