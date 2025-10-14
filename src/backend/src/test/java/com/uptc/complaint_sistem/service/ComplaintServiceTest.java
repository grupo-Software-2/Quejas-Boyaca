package com.uptc.complaint_sistem.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.uptc.complaint_sistem.dto.ComplaintDTO;
import com.uptc.complaint_sistem.mapper.ComplaintMapper;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.ComplaintRepository;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceTest {

    @Mock
    private ComplaintRepository complaintRepository;

    @Mock
    private ComplaintMapper complaintMapper;

    @InjectMocks
    private ComplaintService complaintService;

    private Complaint complaint;
    private ComplaintDTO complaintDTO;

    @BeforeEach
    void setUp() {
        complaint = new Complaint(
                PublicEntity.GOBERNACION_BOYACA,
                "Test complaint",
                "127.0.0.1"
        );
        complaintDTO = new ComplaintDTO();
        complaintDTO.setText("Test complaint");
        complaintDTO.setEntity(PublicEntity.GOBERNACION_BOYACA);
    }

    @Test
    void saveComplaint_withDTO_success() {
        when(complaintMapper.toComplaint(complaintDTO)).thenReturn(complaint);
        when(complaintRepository.save(complaint)).thenReturn(complaint);
        when(complaintMapper.toComplaintDTO(complaint)).thenReturn(complaintDTO);

        ComplaintDTO saved = complaintService.saveComplaint(complaintDTO, "127.0.0.1");

        assertNotNull(saved);
        assertEquals("Test complaint", saved.getText());
        assertEquals(PublicEntity.GOBERNACION_BOYACA, saved.getEntity());
        verify(complaintRepository, times(1)).save(complaint);
    }

    @Test
    void getByEntity_returnsComplaintsDTO() {
        List<Complaint> complaintList = Arrays.asList(complaint);
        List<ComplaintDTO> dtoList = Arrays.asList(complaintDTO);

        when(complaintRepository.findByEntityAndDeletedFalse(PublicEntity.GOBERNACION_BOYACA))
                .thenReturn(complaintList);
        when(complaintMapper.toDTOList(complaintList)).thenReturn(dtoList);

        List<ComplaintDTO> result = complaintService.getByEntity(PublicEntity.GOBERNACION_BOYACA);

        assertEquals(1, result.size());
        assertEquals("Test complaint", result.get(0).getText());
        verify(complaintRepository, times(1))
                .findByEntityAndDeletedFalse(PublicEntity.GOBERNACION_BOYACA);
    }

    @Test
    void getAll_returnsActiveComplaintsDTO() {
        List<Complaint> complaintList = Arrays.asList(complaint);
        List<ComplaintDTO> dtoList = Arrays.asList(complaintDTO);

        when(complaintRepository.findByDeletedFalse()).thenReturn(complaintList);
        when(complaintMapper.toDTOList(complaintList)).thenReturn(dtoList);

        List<ComplaintDTO> result = complaintService.getAll();

        assertEquals(1, result.size());
        assertEquals("Test complaint", result.get(0).getText());
        verify(complaintRepository, times(1)).findByDeletedFalse();
    }

    @Test
    void getById_returnsDTO_whenNotDeleted() {
        when(complaintRepository.findById(1L)).thenReturn(Optional.of(complaint));
        when(complaintMapper.toComplaintDTO(complaint)).thenReturn(complaintDTO);

        Optional<ComplaintDTO> result = complaintService.getById(1L);

        assertTrue(result.isPresent());
        assertEquals("Test complaint", result.get().getText());
        verify(complaintRepository, times(1)).findById(1L);
    }
}
