package com.uptc.complaint_sistem.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PublicEntity entity;

    @Column(nullable = false, length = 1000)
    private String text;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String ipAddress;

    public Complaint() {
        this.date = LocalDateTime.now();
    }

    public Complaint(PublicEntity entity, String text, String ipAddress) {
        this.entity = entity;
        this.text = text;
        this.date = LocalDateTime.now();
        this.ipAddress = ipAddress;
    }

    // Getters y Setters
    public Long getId() {
        return id;
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
}

