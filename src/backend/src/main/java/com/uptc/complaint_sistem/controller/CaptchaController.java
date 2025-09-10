package com.uptc.complaint_sistem.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class CaptchaController {

    @Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    @Value("${google.recaptcha.verify-url}")
    private String verifyUrl;

    @PostMapping("/verify-captcha")
    public ResponseEntity<Map<String, Object>> verifyCaptcha(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        RestTemplate restTemplate = new RestTemplate();

        // Construir request con formato application/x-www-form-urlencoded
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> params = new HashMap<>();
        params.put("secret", recaptchaSecret);
        params.put("response", token);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(params, headers);

        boolean success = false;
        try {
            ResponseEntity<Map> googleResponse = restTemplate.postForEntity(
                    verifyUrl,
                    request,
                    Map.class
            );

            if (googleResponse.getBody() != null) {
                success = Boolean.TRUE.equals(googleResponse.getBody().get("success"));
            }
        } catch (Exception e) {
            System.err.println("❌ Error verificando reCAPTCHA: " + e.getMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);

        return ResponseEntity.ok(response);
    }
}
