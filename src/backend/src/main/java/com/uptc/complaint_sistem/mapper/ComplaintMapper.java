package com.uptc.complaint_sistem.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.uptc.complaint_sistem.dto.AnswerDTO;
import com.uptc.complaint_sistem.dto.ComplaintDTO;
import com.uptc.complaint_sistem.model.Complaint;

@Component
public class ComplaintMapper {

    private final AnswerMapper answerMapper;

    public ComplaintMapper(AnswerMapper answerMapper) {
        this.answerMapper = answerMapper;
    }

    public ComplaintDTO toComplaintDTO(Complaint complaint) {
        if (complaint == null) {
            return null;
        }

        ComplaintDTO dto = new ComplaintDTO();
        dto.setId(complaint.getId());
        dto.setEntity(complaint.getEntity());
        dto.setText(complaint.getText());
        dto.setDate(complaint.getDate());
        dto.setIpAddress(complaint.getIpAddress());
        dto.setDeleted(complaint.isDeleted());
        dto.setDeletedAt(complaint.getDeletedAt());
        dto.setStatus(complaint.getStatus()); 

        dto.setFechaFinQueja(complaint.getFechaFinQueja());
        dto.setDuracionRespuesta(complaint.getDuracionRespuesta());

        if (complaint.getAnswers() != null) {
            List<AnswerDTO> answersDTOs = complaint.getAnswers()
                    .stream()
                    .map(answerMapper::toAnswerDTO)
                    .collect(Collectors.toList());
            dto.setAnswers(answersDTOs);
        }

        return dto;
    }

    public Complaint toComplaint(ComplaintDTO dto) {
        if (dto == null) {
            return null;
        }

        Complaint complaint = new Complaint();
        complaint.setEntity(dto.getEntity());
        complaint.setText(dto.getText());

        return complaint;
    }

    public void updateComplaintFromDTO(ComplaintDTO dto, Complaint complaint) {
        if (dto == null || complaint == null) {
            return;
        }
        if (dto.getEntity() != null) {
            complaint.setEntity(dto.getEntity());
        }
        if (dto.getText() != null) {
            complaint.setText(dto.getText());
        }
        
    }

    public List<ComplaintDTO> toDTOList(List<Complaint> complaints) {
        if (complaints == null) {
            return null;
        }

        return complaints.stream()
                .map(this::toComplaintDTO)
                .collect(Collectors.toList());
    }
}