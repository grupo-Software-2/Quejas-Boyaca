package com.uptc.complaint_sistem.controller;

import java.util.List;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.complaint_sistem.event.ReportViewedEvent;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.service.ComplaintService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://taller-quejas.vercel.app"})
public class ComplaintController {

    private final ComplaintService service;
    private final ApplicationEventPublisher eventPublisher;

    public ComplaintController(ComplaintService service, ApplicationEventPublisher eventPublisher) {
        this.service = service;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint,
                                     @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedIp,
                                     HttpServletRequest request) {
        String ipAddress = forwardedIp != null ? forwardedIp : request.getRemoteAddr();
        complaint.setIpAddress(ipAddress);
        return service.saveComplaint(complaint);
    }

    @GetMapping
    public List<Complaint> getAllComplaints(HttpServletRequest request) {
        List<Complaint> complaints = service.getAll();
        publishReportViewedEvent(request, complaints.size(), "REPORTE GENERAL");
        return complaints;
    }

    @GetMapping("/{entity}")
    public List<Complaint> getComplaintsByEntity(@PathVariable PublicEntity entity, HttpServletRequest request) {
        List<Complaint> complaints = service.getByEntity(entity);
        publishReportViewedEvent(request, complaints.size(), "REPORTE DE LA ENTIDAD" + entity.name());
        return complaints;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Long id, @RequestBody Map<String, String> credentials) {
        try {
            String password = credentials.get("password");
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Se requiere contrasenia"));
            }
            service.deleteComplaint(id, password);
            return ResponseEntity.ok().body(Map.of("message", "Queja eliminada exitosamente"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Contrasenia incorrecta"));
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

            ReportViewedEvent event = new ReportViewedEvent(
                this,
                ipAddress,
                userAgent,
                totalComplaints,
                reportType
            );

            eventPublisher.publishEvent(event);

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