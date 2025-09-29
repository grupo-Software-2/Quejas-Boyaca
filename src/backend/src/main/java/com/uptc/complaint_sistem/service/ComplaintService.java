package com.uptc.complaint_sistem.service;

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
