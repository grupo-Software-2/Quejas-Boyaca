package com.uptc.complaint_sistem.controller;

import java.util.List;
import java.util.Map; 

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable; 
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.complaint_sistem.dto.ComplaintDTO;
import com.uptc.complaint_sistem.dto.ComplaintStatusUpdateDTO;
import com.uptc.complaint_sistem.events.dto.ReportViewedEventDTO;
import com.uptc.complaint_sistem.events.publisher.EventPublisher;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.security.AuthClient;
import com.uptc.complaint_sistem.service.ComplaintService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://taller-quejas.vercel.app"})
public class ComplaintController {

    private final ComplaintService service;
    private final EventPublisher eventPublisher;
    private final AuthClient authClient;

    public ComplaintController(ComplaintService service, EventPublisher eventPublisher, AuthClient authClient) {
        this.service = service;
        this.eventPublisher = eventPublisher;
        this.authClient = authClient;
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody ComplaintStatusUpdateDTO statusUpdateDTO) {
        
        try {
       
            if (!authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token invalido"));
            }

            String token = authorizationHeader.substring(7);

            boolean sessionValid = authClient.validateSession(token);
            if (!sessionValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Sesión invalida"));
            }

            service.changeComplaintStatus(id, statusUpdateDTO.getStatus());
            
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of("message", 
                "Solicitud de cambio de estado a " + statusUpdateDTO.getStatus().name() + " aceptada y publicada. El Consumer actualizará el estado y la duración."));
        
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al procesar el cambio de estado"));
        }
    }


    @PostMapping
    public ResponseEntity<ComplaintDTO> createComplaint(
            @Valid @RequestBody ComplaintDTO complaintDTO,
            @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedIp,
            HttpServletRequest request) {

        String ipAddress = forwardedIp != null ? forwardedIp : request.getRemoteAddr();
        ComplaintDTO saved = service.saveComplaint(complaintDTO, ipAddress);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<ComplaintDTO>> getAllComplaints(HttpServletRequest request) {
        List<ComplaintDTO> complaints = service.getAll();
        publishReportViewedEvent(request, complaints.size(), "REPORTE_GENERAL");
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<ComplaintDTO>> getAllComplaintsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction,
            HttpServletRequest request) {

        Sort sort = direction.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ComplaintDTO> complaints = service.getAllPaginated(pageable);

        publishReportViewedEvent(request, (int) complaints.getTotalElements(), "REPORTE_GENERAL_PAGINADO");

        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<ComplaintDTO> getComplaintById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{entity}")
    public ResponseEntity<List<ComplaintDTO>> getComplaintsByEntity(@PathVariable PublicEntity entity,
                                                                    HttpServletRequest request) {

        List<ComplaintDTO> complaints = service.getByEntity(entity);
        publishReportViewedEvent(request, complaints.size(), "REPORTE_DE_LA_ENTIDAD:_" + entity.name());
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/{entity}/paginated")
    public ResponseEntity<Page<ComplaintDTO>> getComplaintsByEntityPaginated(
            @PathVariable PublicEntity entity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction,
            HttpServletRequest request) {

        Sort sort = direction.equalsIgnoreCase("ASC")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ComplaintDTO> complaints = service.getByEntityPaginated(entity, pageable);

        publishReportViewedEvent(request, (int) complaints.getTotalElements(),
                "REPORTE_DE_LA_ENTIDAD_" + entity.name());

        return ResponseEntity.ok(complaints);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateComplaint(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody ComplaintDTO updatedComplaint) {

        try {
            if (!authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token invalido"));
            }

            String token = authorizationHeader.substring(7);

            boolean sessionValid = authClient.validateSession(token);
            if (!sessionValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "sesion invalido"));
            }

            ComplaintDTO updated = service.updateComplaint(id, updatedComplaint);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar la queja"));
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComplaint(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, String> credentials) {

        try {
            String password = credentials.get("password");
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Se requiere contrasenia"));
            }

            if (!authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token invalido"));
            }

            String token = authorizationHeader.substring(7);

            boolean sessionValid = authClient.validateSession(token);
            if (!sessionValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Sesión invalida o expirada"));
            }

            boolean passwordValid = authClient.verifyPassword(token, password);

            if (!passwordValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Contraseña incorrecta"));
            }

            service.deleteComplaint(id);
            return ResponseEntity.ok().body(Map.of("message", "Queja eliminada exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Queja no encontrada"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error mal eliminar la queja"));
        }
    }

    private void publishReportViewedEvent(HttpServletRequest request, int totalComplaints, String reportType) {
        try {
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");

            ReportViewedEventDTO event = ReportViewedEventDTO.builder()
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .totalComplaints(totalComplaints)
                    .reportType(reportType != null ? reportType : "REPORTE_GENERAL")
                    .build();

            eventPublisher.publishReportViewedEvent(event);
        } catch (Exception e) {
            System.err.println("Error publishing report viewed event: " + e.getMessage());
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String forwardedIp = request.getHeader("X-Forwarded-For");
        if (forwardedIp != null && !forwardedIp.isEmpty()) {
            return forwardedIp.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}