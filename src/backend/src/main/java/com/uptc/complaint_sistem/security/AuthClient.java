package com.uptc.complaint_sistem.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class AuthClient {

    private final RestTemplate restTemplate;

    private static final String AUTH_BASE_URL = "https://auth-quejas-boyaca.onrender.com";

    @Autowired
    public AuthClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean validateSession(String token) {
        String url = AUTH_BASE_URL + "/validate-session";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Void> response;
        try {
            response = restTemplate.exchange(url, HttpMethod.GET, request, Void.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (RestClientException e) {
            return false;
        }
    }

    public boolean verifyPassword(String token, String password) {
        String url = AUTH_BASE_URL + "api/auth/verify-password";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of("password", password);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            System.out.println("🔑 Verificando password en AuthService...");
            System.out.println("➡️ URL: " + url);
            System.out.println("➡️ Token: " + token);
            ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.POST, request, Void.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (RestClientException e) {
            return false;
        }
    }
}