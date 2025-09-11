package com.uptc.complaint_sistem.service.notification;

import com.uptc.complaint_sistem.event.ReportViewedEvent;

public interface NotificationService {

    void handleReportViewed(ReportViewedEvent event);

    boolean isEnabled();

    String getNotificationType();
}