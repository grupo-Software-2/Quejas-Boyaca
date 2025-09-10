package com.uptc.complaint_sistem.controller;

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
        "https://tallerquejas-production.up.railway.app/"}) // permitir conexión desde tu app React
public class ComplaintController {
    private final ComplaintService service;

    public ComplaintController(ComplaintService service) {
        this.service = service;
    }

    @PostMapping
    public Complaint crearQueja(@RequestBody Complaint complaint, 
                              @RequestHeader(value = "X-Forwarded-For", required = false) String forwardedIp,
                              HttpServletRequest request) {
        String ipAddress = forwardedIp != null ? forwardedIp : request.getRemoteAddr();
        complaint.setIpAddress(ipAddress);
        return service.saveComplaint(complaint);
    }

    @GetMapping
    public List<Complaint> getAll() {
        return service.getAll();
    }

    @GetMapping("/{entity}")
    public List<Complaint> getByEntity(@PathVariable PublicEntity entity) {
        return service.getByEntity(entity);
    }
}
