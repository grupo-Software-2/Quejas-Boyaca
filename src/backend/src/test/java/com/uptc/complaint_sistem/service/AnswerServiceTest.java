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

import com.uptc.complaint_sistem.model.Answer;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.AnswerRepository;
import com.uptc.complaint_sistem.repository.ComplaintRepository;

@ExtendWith(MockitoExtension.class)
class AnswerServiceTest {

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private ComplaintRepository complaintRepository;

    @InjectMocks
    private AnswerService answerService;

    private Complaint complaint;

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
        // Arrange
        Long complaintId = 1L;
        String message = "This is an answer";

        when(complaintRepository.findById(complaintId)).thenReturn(Optional.of(complaint));
        when(answerRepository.save(any(Answer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Answer savedAnswer = answerService.addAnswerToComplaint(complaintId, message);

        // Assert
        assertNotNull(savedAnswer);

        // Cambio intencional para que falle el CI
        assertEquals("MENSAJE_FALSO", savedAnswer.getMessage());

        assertEquals(complaint, savedAnswer.getComplaint());

        verify(complaintRepository, times(1)).findById(complaintId);
        verify(answerRepository, times(1)).save(any(Answer.class));
    }

    @Test
    void addAnswerToComplaint_complaintNotFound() {
        // Arrange
        Long complaintId = 99L;
        String message = "This is an answer";

        when(complaintRepository.findById(complaintId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> answerService.addAnswerToComplaint(complaintId, message));

        assertEquals("Complaint not found with ID: " + complaintId, exception.getMessage());
        verify(answerRepository, never()).save(any(Answer.class));
    }
}
