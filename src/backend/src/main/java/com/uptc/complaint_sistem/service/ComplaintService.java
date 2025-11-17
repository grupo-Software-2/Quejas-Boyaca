package com.uptc.complaint_sistem.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
 
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uptc.complaint_sistem.dto.ComplaintDTO;
import com.uptc.complaint_sistem.mapper.ComplaintMapper;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.ComplaintStatus;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.ComplaintRepository;
import com.uptc.complaint_sistem.service.events.QuejaStatusChangeEvent;

@Service
@Transactional
public class ComplaintService {
    private final ComplaintRepository repository;
    private final ComplaintMapper mapper;
    private final EventPublisherService eventPublisherService;

    public ComplaintService(ComplaintRepository repository, ComplaintMapper mapper, EventPublisherService eventPublisherService) {
        this.repository = repository;
        this.mapper = mapper;
        this.eventPublisherService = eventPublisherService;
    }

    public void changeComplaintStatus(Long complaintId, ComplaintStatus newStatus) {
        Optional<Complaint> complaintOpt = repository.findById(complaintId);

        if (complaintOpt.isEmpty()) {
            throw new IllegalArgumentException("Queja no encontrada con ID: " + complaintId);
        }

        Complaint complaint = complaintOpt.get();
        String estadoAnterior = complaint.getStatus().name();

        if (complaint.getStatus().equals(newStatus)) {
            return; 
        }

        QuejaStatusChangeEvent event = new QuejaStatusChangeEvent(
            complaintId,
            estadoAnterior,
            newStatus.name(), 
            LocalDateTime.now()
        );

        eventPublisherService.publishStatusChangeEvent(event);
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

    public boolean deleteComplaint(Long id) {
        Optional<Complaint> complaintOpt = repository.findById(id);
        if (complaintOpt.isEmpty()) {
            throw new IllegalArgumentException("Queja no encontrada");
        }
        Complaint complaint = complaintOpt.get();
        if (complaint.isDeleted()) {
            throw new IllegalArgumentException("La queja esta eliminada");
        }
        complaint.setDeleted(true);
        repository.save(complaint);
        return true;
    }

    public ComplaintDTO updateComplaint(Long id, ComplaintDTO updatedDTO) {
        Optional<Complaint> complaintOpt = repository.findById(id);

        if (complaintOpt.isEmpty()) {
            throw new IllegalArgumentException("Queja no encontrada con ID: " + id);
        }

        Complaint complaint = complaintOpt.get();

        if (complaint.isDeleted()) {
            throw new IllegalArgumentException("No se puede editar una queja eliminada");
        }

        if (updatedDTO.getText() != null && !updatedDTO.getText().isEmpty()) {
            complaint.setText(updatedDTO.getText());
        }
        
        Complaint updated = repository.save(complaint);
        return mapper.toComplaintDTO(updated);
    }
}