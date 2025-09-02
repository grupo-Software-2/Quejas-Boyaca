package com.uptc.complaint_sistem.controller;

import com.uptc.complaint_sistem.model.Complaint;
import com.uptc.complaint_sistem.model.PublicEntity;
import com.uptc.complaint_sistem.service.ComplaintService;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173/") // permitir conexión desde tu app React
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
