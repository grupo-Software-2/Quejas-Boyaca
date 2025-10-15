package com.uptc.complaint_sistem.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.complaint_sistem.dto.AnswerDTO;
import com.uptc.complaint_sistem.mapper.AnswerMapper;
import com.uptc.complaint_sistem.model.Answer;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.ComplaintStatus;
import com.uptc.complaint_sistem.repository.AnswerRepository;
import com.uptc.complaint_sistem.repository.ComplaintRepository;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private AnswerMapper answerMapper;

    public AnswerDTO addAnswerToComplaint(Long complaintId, String message) {
        // Buscar la queja por su ID
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        // Actualizar el estado de la queja a "REVISION"
        complaint.setStatus(ComplaintStatus.REVISION);
        complaintRepository.save(complaint); // Guardar explícitamente el cambio de estado

        // Crear una nueva respuesta y asociarla a la queja
        Answer answer = new Answer(message, complaint);

        // Guardar la respuesta en la base de datos
        Answer savedAnswer = answerRepository.save(answer);
        return answerMapper.toAnswerDTO(savedAnswer);
    }

    public List<AnswerDTO> getAnswersByComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        return complaint.getAnswers().stream()
                .map(answerMapper::toAnswerDTO)
                .collect(Collectors.toList());
    }

    public AnswerDTO getAnswerById(Long id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found with ID: " + id));
        return answerMapper.toAnswerDTO(answer);
    }

    public void deleteAnswer(Long id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found with ID: " + id));
        answerRepository.delete(answer);
    }
}