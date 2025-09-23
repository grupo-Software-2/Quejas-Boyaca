package com.uptc.complaint_sistem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.complaint_sistem.model.Answer;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.repository.AnswerRepository;
import com.uptc.complaint_sistem.repository.ComplaintRepository;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    public Answer addAnswerToComplaint(Long complaintId, String message) {
        // Buscar la queja por su ID
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        // Crear una nueva respuesta y asociarla a la queja
        Answer answer = new Answer(message, complaint);

        // Guardar la respuesta en la base de datos
        return answerRepository.save(answer);
    }
}