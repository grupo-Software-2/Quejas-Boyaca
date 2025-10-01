package com.uptc.complaint_sistem.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils; 

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.repository.ComplaintRepository;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceTest {

    private Complaint complaint;
    private final PublicEntity TEST_ENTITY = PublicEntity.GOBERNACION_BOYACA;
    private final Pageable PAGEABLE = PageRequest.of(0, 10);
    private final String ADMIN_PASSWORD = "admin_password_test"; 

    @Mock
    private ComplaintRepository complaintRepository;

    @InjectMocks
    private ComplaintService complaintService;

    @BeforeEach
    void setUp() {
        complaint = new Complaint(
                TEST_ENTITY,
                "Test complaint",
                "127.0.0.1"
        );
        // Inyectar la contraseña de administrador (necesario para el test de eliminación)
        ReflectionTestUtils.setField(complaintService, "adminPassword", ADMIN_PASSWORD);
    }

    @Test
    void saveComplaint_success() {
        when(complaintRepository.save(any(Complaint.class))).thenReturn(complaint);
        Complaint saved = complaintService.saveComplaint(complaint);
        assertNotNull(saved);
        verify(complaintRepository, times(1)).save(complaint);
    }

    @Test
    void getByEntity_returnsComplaints() {
        List<Complaint> expectedList = Arrays.asList(complaint);
        
        // CORREGIDO: Llama al método correcto del repositorio para el filtrado.
        when(complaintRepository.findByEntityAndDeletedFalse(TEST_ENTITY)).thenReturn(expectedList);

        List<Complaint> result = complaintService.getByEntity(TEST_ENTITY);

        assertEquals(1, result.size());
        verify(complaintRepository, times(1)).findByEntityAndDeletedFalse(TEST_ENTITY);
    }

    @Test
    void getAll_returnsAllComplaints() {
        List<Complaint> expectedList = Arrays.asList(complaint);
        
        // CORREGIDO: Llama al método correcto del repositorio para el borrado suave.
        when(complaintRepository.findByDeletedFalse()).thenReturn(expectedList);

        List<Complaint> result = complaintService.getAll();

        assertEquals(1, result.size());
        verify(complaintRepository, times(1)).findByDeletedFalse();
    }
  
    @Test
    void getAllPaginated_returnsPageOfComplaints() {
        Page<Complaint> expectedPage = new PageImpl<>(Arrays.asList(complaint));
        
        when(complaintRepository.findByDeletedFalse(PAGEABLE)).thenReturn(expectedPage);

        Page<Complaint> result = complaintService.getAllPaginated(PAGEABLE);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(complaintRepository, times(1)).findByDeletedFalse(PAGEABLE);
    }
    
    @Test
    void getByEntityPaginated_returnsPageOfFilteredComplaints() {
        Page<Complaint> expectedPage = new PageImpl<>(Arrays.asList(complaint));
        
        when(complaintRepository.findByEntityAndDeletedFalse(TEST_ENTITY, PAGEABLE)).thenReturn(expectedPage);

        Page<Complaint> result = complaintService.getByEntityPaginated(TEST_ENTITY, PAGEABLE);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(complaintRepository, times(1)).findByEntityAndDeletedFalse(TEST_ENTITY, PAGEABLE);
    }
    
    @Test
    void deleteComplaint_withCorrectPassword_shouldMarkAsDeleted() {
        Long id = 1L;
        Complaint c = new Complaint();
        c.setDeleted(false);

        when(complaintRepository.findById(id)).thenReturn(Optional.of(c));

        boolean result = complaintService.deleteComplaint(id, ADMIN_PASSWORD);
        assertTrue(result);
        assertTrue(c.isDeleted());
        verify(complaintRepository, times(1)).save(c);
    }

    @Test
    void deleteComplaint_withIncorrectPassword_shouldThrowSecurityException() {
        Long id = 1L;
        assertThrows(SecurityException.class, () -> {
            complaintService.deleteComplaint(id, "wrong_password");
        });
        verify(complaintRepository, never()).findById(anyLong());
    }

    @Test
    void deleteComplaint_whenComplaintNotFound_shouldThrowIllegalArgumentException() {
        Long id = 1L;
        when(complaintRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            complaintService.deleteComplaint(id, ADMIN_PASSWORD);
        });
    }

    @Test
    void deleteComplaint_whenAlreadyDeleted_shouldThrowIllegalStateException() {
        Long id = 1L;
        Complaint c = new Complaint();
        c.setDeleted(true);

        when(complaintRepository.findById(id)).thenReturn(Optional.of(c));

        assertThrows(IllegalStateException.class, () -> {
            complaintService.deleteComplaint(id, ADMIN_PASSWORD);
        });
    }
}