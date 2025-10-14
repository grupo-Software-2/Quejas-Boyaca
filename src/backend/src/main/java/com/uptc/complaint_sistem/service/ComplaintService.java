package com.uptc.complaint_sistem.service;

import java.util.List;
import java.util.Optional;

import com.uptc.complaint_sistem.dto.ComplaintDTO;
import com.uptc.complaint_sistem.mapper.ComplaintMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.ComplaintRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ComplaintService {
    private final ComplaintRepository repository;
    private final ComplaintMapper mapper;

    @Value("${admin.delete.password}")
    private String adminPassword;

    public ComplaintService(ComplaintRepository repository, ComplaintMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public Complaint saveComplaint(Complaint complaint) {
        return repository.save(complaint);
    }

    public ComplaintDTO saveComplaint(ComplaintDTO dto, String ipAddress) {
        Complaint complaint = mapper.toComplaint(dto);
        complaint.setIpAddress(ipAddress);

        Complaint saved = repository.save(complaint);
        return mapper.toComplaintDTO(saved);
    }

    @Transactional(readOnly = true)
    public Page<ComplaintDTO> getAllPaginated(Pageable pageable) {
        return repository.findByDeletedFalse(pageable).map(mapper::toComplaintDTO);
    }

    @Transactional(readOnly = true)
    public Page<ComplaintDTO> getByEntityPaginated(PublicEntity entity, Pageable pageable) {
        return repository.findByEntityAndDeletedFalse(entity, pageable)
                .map(mapper::toComplaintDTO);
    }

    @Transactional(readOnly = true)
    public List<ComplaintDTO> getByEntity(PublicEntity entity) {
        List<Complaint> complaints = repository.findByEntityAndDeletedFalse(entity);
        return mapper.toDTOList(complaints);
    }

    @Transactional(readOnly = true)
    public List<ComplaintDTO> getAll() {
        List<Complaint> complaints = repository.findByDeletedFalse();
        return mapper.toDTOList(complaints);
    }

    @Transactional(readOnly = true)
    public Optional<ComplaintDTO> getById(Long id) {
        return repository.findById(id)
                .filter(complaint -> !complaint.isDeleted())
                .map(mapper::toComplaintDTO);
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