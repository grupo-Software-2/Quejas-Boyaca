package com.uptc.complaint_sistem.dto;

import com.uptc.complaint_sistem.model.ComplaintStatus;
import com.uptc.complaint_sistem.model.PublicEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public class ComplaintDTO {

    private Long id;

    @NotNull(message = "La entidad es obligatoria")
    private PublicEntity entity;

    @NotBlank(message = "El texto de la queja no puede estar vacio")
    @Size(max = 1000, message = "El texto no puede exceder los 1000 caracteres")
    private String text;

    private LocalDateTime date;
    private String ipAddress;
    private boolean deleted;
    private LocalDateTime deletedAt;
    private List<AnswerDTO> answers;
    private ComplaintStatus status;

    public ComplaintDTO() {
    }

    public ComplaintDTO(Long id, PublicEntity entity, String text, LocalDateTime date, String ipAddress, boolean deleted, LocalDateTime deletedAt, List<AnswerDTO> answers, ComplaintStatus status) {
        this.id = id;
        this.entity = entity;
        this.text = text;
        this.date = date;
        this.ipAddress = ipAddress;
        this.deleted = deleted;
        this.deletedAt = deletedAt;
        this.answers = answers;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PublicEntity getEntity() {
        return entity;
    }

    public void setEntity(PublicEntity entity) {
        this.entity = entity;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public List<AnswerDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }

    public ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintStatus status) {
        this.status = status;
    }
}
