package com.uptc.complaint_sistem.service;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.ComplaintRepository;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @InjectMocks
    private ComplaintService complaintService;

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
    void saveComplaint_success() {

        when(complaintRepository.save(complaint)).thenReturn(complaint);

        Complaint saved = complaintService.saveComplaint(complaint);

        assertNotNull(saved);
        assertEquals("Test complaint", saved.getText());
        assertEquals(PublicEntity.GOBERNACION_BOYACA, saved.getEntity());
        verify(complaintRepository, times(1)).save(complaint);
    }

    @Test
    void getByEntity_returnsComplaints() {

        List<Complaint> expectedList = Arrays.asList(complaint);
        when(complaintRepository.findByEntityAndDeletedFalse(PublicEntity.GOBERNACION_BOYACA))
                .thenReturn(expectedList);

        List<Complaint> result = complaintService.getByEntity(PublicEntity.GOBERNACION_BOYACA);

        assertEquals(1, result.size());
        assertEquals(complaint, result.get(0));
        verify(complaintRepository, times(1))
                .findByEntityAndDeletedFalse(PublicEntity.GOBERNACION_BOYACA);
    }

    @Test
    void getAll_returnsActiveComplaints() {

        List<Complaint> expectedList = Arrays.asList(complaint);
        when(complaintRepository.findByDeletedFalse()).thenReturn(expectedList);

        List<Complaint> result = complaintService.getAll();

        assertEquals(1, result.size());
        assertEquals("Test complaint", result.get(0).getText());
        verify(complaintRepository, times(1)).findByDeletedFalse();
    }
}
