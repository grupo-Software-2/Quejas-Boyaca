package com.uptc.complaint_sistem.service.notification.impl;

import com.uptc.complaint_sistem.event.ReportViewedEvent;
import com.uptc.complaint_sistem.model.notification.ReportViewNotification;
import com.uptc.complaint_sistem.service.notification.NotificationService;
import com.uptc.complaint_sistem.service.notification.strategy.EmailStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    @Autowired
    private EmailStrategy emailStrategy;

    @Value("${notification.email.enabled:true}")
    private boolean emailNotificationsEnabled;

    @Value("${notification.email.admin-emails}")
    private String[] adminEmails;

    @Override
    @EventListener
    public void handleReportViewed(ReportViewedEvent event) {
        if (!isEnabled()) {
            log.debug("Email notifications disabled, skipping report view alert");
            return;
        }

        try {
            log.info("Processing report view notification for IP: {}", event.getUserIpAddress());

            ReportViewNotification notification = ReportViewNotification.builder()
                    .ipAddress(event.getUserIpAddress())
                    .viewedAt(event.getViewedAt())
                    .userAgent(event.getUserAgent())
                    .totalComplaints(event.getTotalComplaints())
                    .reportType(event.getReportType())
                    .build();

            emailStrategy.sendReportViewAlert(notification, adminEmails);

            log.info("Report view notification sent successfully to {} admins", adminEmails.length);

        } catch (Exception e) {
            log.error("Failed to send report view notification", e);
            // No lanzar excepción para no afectar el flujo principal
        }
    }

    @Override
    public boolean isEnabled() {
        return emailNotificationsEnabled && adminEmails != null && adminEmails.length > 0;
    }

    @Override
    public String getNotificationType() {
        return "EMAIL";
    }
}