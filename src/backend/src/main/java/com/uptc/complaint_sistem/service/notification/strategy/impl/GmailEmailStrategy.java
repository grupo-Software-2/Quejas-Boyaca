package com.uptc.complaint_sistem.service.notification.strategy.impl;

import com.uptc.complaint_sistem.model.notification.ReportViewNotification;
import com.uptc.complaint_sistem.service.notification.strategy.EmailStrategy;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Component
public class GmailEmailStrategy implements EmailStrategy {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${notification.email.from:a6792f61cf2e9c}")
    private String fromEmail;

    @Value("${notification.email.from-name:Sistema de Quejas Boyacá}")
    private String fromName;

    @Override
    public void sendReportViewAlert(ReportViewNotification notification, String[] recipients) {
        try {
            String subject = String.format("🔍 Reporte Visualizado - %s quejas (%s)",
                    notification.getTotalComplaints(),
                    notification.getViewedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

            String htmlContent = generateEmailContent(notification);

            for (String recipient : recipients) {
                sendEmail(recipient, subject, htmlContent);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error sending report view alert", e);
        }
    }

    private String generateEmailContent(ReportViewNotification notification) {
        Context context = new Context();
        context.setVariable("notification", notification);
        context.setVariable("viewedAtFormatted",
                notification.getViewedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")));

        return templateEngine.process("email/report-viewed-alert", context);
    }

    private void sendEmail(String to, String subject, String htmlContent) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setFrom(fromEmail, fromName);

        mailSender.send(message);
    }

    @Override
    public boolean isAvailable() {
        try {
            mailSender.createMimeMessage(); // Test básico
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}