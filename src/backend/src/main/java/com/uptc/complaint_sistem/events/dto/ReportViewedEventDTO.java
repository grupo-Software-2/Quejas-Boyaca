package com.uptc.complaint_sistem.event;

import org.springframework.context.ApplicationEvent;

import java.time.LocalDateTime;

public class ReportViewedEvent extends ApplicationEvent {
    private final String userIpAddress;
    private final LocalDateTime viewedAt;
    private final String userAgent;
    private final int totalComplaints;
    private final String reportType;

    public ReportViewedEvent(Object source, String userIpAddress, String userAgent,
                             int totalComplaints, String reportType) {
        super(source);
        this.userIpAddress = userIpAddress;
        this.viewedAt = LocalDateTime.now();
        this.userAgent = userAgent;
        this.totalComplaints = totalComplaints;
        this.reportType = reportType;
    }

    // Getters
    public String getUserIpAddress() {
        return userIpAddress;
    }

    public LocalDateTime getViewedAt() {
        return viewedAt;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public int getTotalComplaints() {
        return totalComplaints;
    }

    public String getReportType() {
        return reportType;
    }
}