package com.uptc.complaint_sistem.service;

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintService {
    private final ComplaintRepository repository;

    public ComplaintService(ComplaintRepository repository) {
        this.repository = repository;
    }

    public Complaint saveComplaint(Complaint complaint) {
        return repository.save(complaint);
    }

    public List<Complaint> getByEntity(PublicEntity entity) {
        return repository.findByEntity(entity);
    }

    public List<Complaint> getAll() {
        return repository.findAll();
    }
}
