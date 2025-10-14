package com.uptc.complaint_sistem.service;

import com.uptc.complaint_sistem.dto.AnswerDTO;
import com.uptc.complaint_sistem.mapper.AnswerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uptc.complaint_sistem.model.Answer;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.repository.AnswerRepository;
import com.uptc.complaint_sistem.repository.ComplaintRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private AnswerMapper answerMapper;

    public AnswerDTO addAnswerToComplaint(Long complaintId, String message) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        Answer answer = new Answer(message, complaint);
        Answer saved = answerRepository.save(answer);

        return answerMapper.toAnswerDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<AnswerDTO> getAnswersByComplaint(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Queja no encontrada con ID: " +  complaintId));

        return answerMapper.toDTOList(complaint.getAnswers());
    }

    @Transactional(readOnly = true)
    public AnswerDTO getAnswerById(Long id) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Respuesta no encontrada con ID: " + id));
        return answerMapper.toAnswerDTO(answer);
    }

    public boolean deleteAnswer(Long id) {
        if (!answerRepository.existsById(id)) {
            throw new RuntimeException("Respuesta no encontrada con ID: " + id);
        }
        answerRepository.deleteById(id);
        return true;
    }
}