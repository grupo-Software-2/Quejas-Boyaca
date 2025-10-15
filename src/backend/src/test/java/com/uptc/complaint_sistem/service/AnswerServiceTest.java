package com.uptc.complaint_sistem.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uptc.complaint_sistem.dto.AnswerDTO;
import com.uptc.complaint_sistem.mapper.AnswerMapper;
import com.uptc.complaint_sistem.model.Answer;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.ComplaintStatus;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.AnswerRepository;
import com.uptc.complaint_sistem.repository.ComplaintRepository;

@ExtendWith(MockitoExtension.class)
class AnswerServiceTest {

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private ComplaintRepository complaintRepository;

    @Mock
    private AnswerMapper answerMapper;

    @InjectMocks
    private AnswerService answerService;

    private Complaint complaint, complaintWithAnswer;
    private Answer answer;

    @BeforeEach
    void setUp() {
        complaint = new Complaint(
                PublicEntity.GOBERNACION_BOYACA,
                "Test complaint",
                "127.0.0.1"
        );
    }

    @Test
    void addAnswerToComplaint_success() {

        Long complaintId = 1L;
        String message = "This is an answer";
        answer = new Answer(message, complaint);
        AnswerDTO answerDTO = new AnswerDTO();
        answerDTO.setMessage(message);

        when(complaintRepository.findById(complaintId)).thenReturn(Optional.of(complaint));
        when(answerRepository.save(any(Answer.class))).thenReturn(answer);
        when(answerMapper.toAnswerDTO(answer)).thenReturn(answerDTO);

        AnswerDTO savedAnswer = answerService.addAnswerToComplaint(complaintId, message);

        assertNotNull(savedAnswer);
        assertEquals(message, savedAnswer.getMessage());

        assertEquals(ComplaintStatus.REVISION, complaint.getStatus());

        verify(complaintRepository, times(1)).findById(complaintId);
        verify(complaintRepository, times(1)).save(complaint);
        verify(answerRepository, times(1)).save(any(Answer.class));
        verify(answerMapper, times(1)).toAnswerDTO(answer);
    }

    @Test
    void addAnswerToComplaint_complaintNotFound() {

        Long complaintId = 99L;
        String message = "This is an answer";

        when(complaintRepository.findById(complaintId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> answerService.addAnswerToComplaint(complaintId, message));

        assertEquals("Complaint not found with ID: " + complaintId, exception.getMessage());
        verify(answerRepository, never()).save(any(Answer.class));
    }

    @Test
    void deleteAnswer_success() {
        Long answerId = 1L;
        answer = new Answer("Some answer", complaint);

        when(answerRepository.findById(answerId)).thenReturn(Optional.of(answer));

        answerService.deleteAnswer(answerId);

        verify(answerRepository, times(1)).findById(answerId);
        verify(answerRepository, times(1)).delete(answer);
    }

    @Test
    void deleteAnswer_notFound() {
        Long answerId = 99L;

        when(answerRepository.findById(answerId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> answerService.deleteAnswer(answerId));

        assertEquals("Answer not found with ID: " + answerId, exception.getMessage());
        verify(answerRepository, never()).delete(any(Answer.class));
    }
}
