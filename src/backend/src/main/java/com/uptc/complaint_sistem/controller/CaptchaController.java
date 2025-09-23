package com.uptc.complaint_sistem.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://tallerquejas-production.up.railway.app"})
public class CaptchaController {

    @Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    @Value("${google.recaptcha.verify-url}")
    private String verifyUrl;

    @PostMapping("/verify-captcha")
    public ResponseEntity<Map<String, Object>> verifyCaptcha(@RequestBody Map<String, String> body) {
        String token = body.get("token");

        RestTemplate restTemplate = new RestTemplate();

        // ✅ Usar MultiValueMap para form-urlencoded
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("secret", recaptchaSecret);
        params.add("response", token);

        Map<String, Object> googleResponse = restTemplate.postForObject(
                verifyUrl,
                params,
                Map.class
        );

        boolean success = googleResponse != null && Boolean.TRUE.equals(googleResponse.get("success"));

        return ResponseEntity.ok(Map.of("success", success));
    }
}
