package com.uptc.complaint_sistem.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.ComplaintRepository;

@Service
public class ComplaintService {
    private final ComplaintRepository repository;

    @Value("${admin.delete.password}")
    private String adminPassword;

    public ComplaintService(ComplaintRepository repository) {
        this.repository = repository;
    }

    public Complaint saveComplaint(Complaint complaint) {
        return repository.save(complaint);
    }

    // ***************************************************************
    // MÉTODOS DE PAGINACIÓN IMPLEMENTADOS (Nuevos)
    // ***************************************************************
    public Page<Complaint> getAllPaginated(Pageable pageable) {
        return repository.findByDeletedFalse(pageable); 
    }

    public Page<Complaint> getByEntityPaginated(PublicEntity entity, Pageable pageable) {
        return repository.findByEntityAndDeletedFalse(entity, pageable); 
    }

    // Métodos antiguos (sin paginación)
    public List<Complaint> getByEntity(PublicEntity entity) {
        return repository.findByEntityAndDeletedFalse(entity);
    }

    public List<Complaint> getAll() {
        return repository.findByDeletedFalse();
    }

    public boolean deleteComplaint(Long id, String password) {
        if (!adminPassword.equals(password)) {
            throw new SecurityException("Contrasenia Incorrecta");
        }
        Optional<Complaint> complaintOpt = repository.findById(id);
        if (complaintOpt.isEmpty()) {
            throw new IllegalArgumentException("Queja no encontrada");
        }
        Complaint complaint = complaintOpt.get();
        if (complaint.isDeleted()) {
            throw new IllegalStateException("La queja ya fue eliminada");
        }
        complaint.setDeleted(true);
        repository.save(complaint);
        return true;
    }
}