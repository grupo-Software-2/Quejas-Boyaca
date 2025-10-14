package com.uptc.complaint_sistem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class AnswerDTO {

    private Long id;

    @NotBlank(message = "El mensaje no puede estar vacio")
    @Size(max = 1000, message = "El mensaje no puede exceder los 1000 caracteres")
    private String message;

    private LocalDateTime date;
    private Long complaintId;

    public AnswerDTO() {}

    public AnswerDTO(Long id, String message, LocalDateTime date, Long complaintId) {
        this.id = id;
        this.message = message;
        this.date = date;
        this.complaintId = complaintId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Long getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }
}
