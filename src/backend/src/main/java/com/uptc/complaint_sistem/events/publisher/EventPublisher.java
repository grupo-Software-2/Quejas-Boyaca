package com.uptc.complaint_sistem.events.publisher;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uptc.complaint_sistem.events.dto.ReportViewedEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;

@Component
public class EventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EventPublisher.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${event.broker.url:http://localhost:8082}")
    private String brokerUrl;

    @Value("${event.broker.enabled:true}")
    private boolean brokerEnabled;

    public EventPublisher(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Async("eventPublisherExecutor")
    public CompletableFuture<Void> publishReportViewedEvent(ReportViewedEventDTO event) {
        return CompletableFuture.runAsync(() -> {
            if (!brokerEnabled) {
                log.debug("Event broker disabled, skipping event publication");
                return;
            }

            try {
                String url = brokerUrl + "/api/events/publish";

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<ReportViewedEventDTO> request = new HttpEntity<>(event, headers);

                log.debug("Publishing event {} to broker", event.getEventId());

                ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info("Event {} published successfully to broker", event.getEventId());
                } else {
                    log.warn("Failed to publish event {}, status: {}", event.getEventId(), response.getStatusCode());
                }
            } catch (Exception e) {
                log.error("Error publishing event {} to broker: {}", event.getEventId(), e.getMessage(), e);
            }
        });
    }

    @Async("eventPublisherExecutor")
    public CompletableFuture<Boolean> checkBrokerHealth() {
        return CompletableFuture.supplyAsync(() -> {
            try {
                String healthUrl = brokerUrl + "/api/events/health";
                ResponseEntity<String> response = restTemplate.getForEntity(healthUrl, String.class);
                return response.getStatusCode().is2xxSuccessful();
            } catch (Exception e) {
                log.error("Broker health check failed: {}", e.getMessage());
                return false;
            }
        });
    }
}
