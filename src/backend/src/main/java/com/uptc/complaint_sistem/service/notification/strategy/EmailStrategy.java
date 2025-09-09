package com.uptc.complaint_sistem.service.notification.strategy;

import com.uptc.complaint_sistem.model.notification.ReportViewNotification;

public interface EmailStrategy {

    void sendReportViewAlert(ReportViewNotification notification, String[] recipients);

    boolean isAvailable();
}