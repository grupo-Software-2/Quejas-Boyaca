package com.uptc.complaint_sistem.model.notification;

import java.time.LocalDateTime;

public class ReportViewNotification {
    private String ipAddress;
    private LocalDateTime viewedAt;
    private String userAgent;
    private int totalComplaints;
    private String reportType;
    private String location; // Opcional: geolocalización

    // Constructor privado para Builder pattern
    private ReportViewNotification(Builder builder) {
        this.ipAddress = builder.ipAddress;
        this.viewedAt = builder.viewedAt;
        this.userAgent = builder.userAgent;
        this.totalComplaints = builder.totalComplaints;
        this.reportType = builder.reportType;
        this.location = builder.location;
    }

    // Builder Pattern para construcción flexible
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String ipAddress;
        private LocalDateTime viewedAt;
        private String userAgent;
        private int totalComplaints;
        private String reportType;
        private String location;

        public Builder ipAddress(String ipAddress) {
            this.ipAddress = ipAddress;
            return this;
        }

        public Builder viewedAt(LocalDateTime viewedAt) {
            this.viewedAt = viewedAt;
            return this;
        }

        public Builder userAgent(String userAgent) {
            this.userAgent = userAgent;
            return this;
        }

        public Builder totalComplaints(int totalComplaints) {
            this.totalComplaints = totalComplaints;
            return this;
        }

        public Builder reportType(String reportType) {
            this.reportType = reportType;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public ReportViewNotification build() {
            return new ReportViewNotification(this);
        }
    }

    // Getters
    public String getIpAddress() { return ipAddress; }
    public LocalDateTime getViewedAt() { return viewedAt; }
    public String getUserAgent() { return userAgent; }
    public int getTotalComplaints() { return totalComplaints; }
    public String getReportType() { return reportType; }
    public String getLocation() { return location; }

    public String getBrowserInfo() {
        if (userAgent == null) return "Desconocido";

        if (userAgent.contains("Chrome")) return "Chrome";
        if (userAgent.contains("Firefox")) return "Firefox";
        if (userAgent.contains("Safari")) return "Safari";
        if (userAgent.contains("Edge")) return "Edge";
        return "Otro navegador";
    }
}