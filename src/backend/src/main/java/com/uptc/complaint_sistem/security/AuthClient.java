package com.uptc.complaint_sistem.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AuthClient {

    private static final String AUTH_BASE_URL = "https://auth-quejas-boyaca.onrender.com";
    private final RestTemplate restTemplate;

    @Autowired
    public AuthClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean validateSession(String token) {
        String url = AUTH_BASE_URL + "/api/auth/validate-session";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<Void> request = new HttpEntity<>(headers);
        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);

            return response.getStatusCode().is2xxSuccessful();
        } catch (RestClientException e) {
            System.err.println("Error validando sesión: " + e.getMessage());
            if (e instanceof org.springframework.web.client.HttpClientErrorException) {
                org.springframework.web.client.HttpClientErrorException httpError =
                        (org.springframework.web.client.HttpClientErrorException) e;
                System.err.println("Status: " + httpError.getStatusCode());
                System.err.println("Response: " + httpError.getResponseBodyAsString());
            }
            return false;
        }
    }

    public boolean verifyPassword(String token, String password) {
        String url = AUTH_BASE_URL + "/api/auth/verify-password";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of("password", password);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            return response.getStatusCode().is2xxSuccessful();
        } catch (RestClientException e) {
            System.err.println("Error validando password: " + e.getMessage());
            if (e instanceof org.springframework.web.client.HttpClientErrorException) {
                org.springframework.web.client.HttpClientErrorException httpError =
                        (org.springframework.web.client.HttpClientErrorException) e;
                System.err.println("Status: " + httpError.getStatusCode());
                System.err.println("Response: " + httpError.getResponseBodyAsString());
            }
            return false;
        }
    }
}