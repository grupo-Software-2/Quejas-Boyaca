package com.uptc.complaint_sistem.events.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class ReportViewedEventDTO {

    private String eventId;
    private String eventType;
    private String ipAddress;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    private String userAgent;
    private int totalComplaints;
    private String reportType;
    private String source;

    public ReportViewedEventDTO() {
        this.eventType = "REPORT_VIEWED";
        this.timestamp = LocalDateTime.now();
        this.source = "complaint-system";
        this.reportType = "REPORTE_GENERAL";
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public int getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(int totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public static class Builder {
        private final ReportViewedEventDTO dto = new ReportViewedEventDTO();

        public Builder eventId(String eventId) {
            dto.eventId = eventId;
            return this;
        }

        public Builder ipAddress(String ipAddress) {
            dto.ipAddress = ipAddress;
            return this;
        }

        public Builder userAgent(String userAgent) {
            dto.userAgent = userAgent;
            return this;
        }

        public Builder totalComplaints(int totalComplaints) {
            dto.totalComplaints = totalComplaints;
            return this;
        }

        public Builder reportType(String reportType) {
            dto.reportType = (reportType != null && !reportType.isEmpty()) ? reportType : "REPORTE_GENERAL";
            return this;
        }

        public ReportViewedEventDTO build() {
            dto.eventId = java.util.UUID.randomUUID().toString();
            return dto;
        }
    }
}