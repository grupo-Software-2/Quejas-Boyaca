package com.uptc.complaint_sistem.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Método que usabas sin paginación, se mantiene por si acaso
    List<Complaint> findByEntityAndDeletedFalse(PublicEntity entity);
    List<Complaint> findByDeletedFalse();

    
    // 1. Paginación de todas las quejas no eliminadas
    Page<Complaint> findByDeletedFalse(Pageable pageable);
    
    // 2. Paginación de quejas filtradas por entidad y no eliminadas
    Page<Complaint> findByEntityAndDeletedFalse(PublicEntity entity, Pageable pageable);
}