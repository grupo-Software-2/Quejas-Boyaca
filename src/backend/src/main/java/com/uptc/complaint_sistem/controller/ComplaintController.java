package com.uptc.complaint_sistem.controller;

import com.uptc.complaint_sistem.event.ReportViewedEvent;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.service.ComplaintService;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.service.ComplaintService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://tallerquejas-production.up.railway.app"}) // permitir conexión desde tu app React
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
    public List<Complaint> getAll(HttpServletRequest request) {
        List<Complaint> complaints = service.getAll();
        publishReportViewedEvent(request, complaints.size(), "GENERAL_REPORT");
        return complaints;
    }

    @GetMapping("/{entity}")
    public List<Complaint> getByEntity(@PathVariable PublicEntity entity, HttpServletRequest request) {
        List<Complaint> complaints = service.getByEntity(entity);
        publishReportViewedEvent(request, complaints.size(), "ENTITY_REPORT" + entity.name());
        return complaints;
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
            // Log error but don't break the main flow
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

