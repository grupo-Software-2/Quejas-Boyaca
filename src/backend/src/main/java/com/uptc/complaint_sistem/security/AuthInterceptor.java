package com.uptc.complaint_sistem.security;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final AuthClient authClient;

    public AuthInterceptor(AuthClient authClient) {
        this.authClient = authClient;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String token = request.getHeader("Authorization");

        if (token == null || token.isEmpty()) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing Token");
            return false;
        }

        token = token.replace("Bearer ", "");

        boolean valid = authClient.validateSession(token);

        if (!valid) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
            return false;
        }

        return true;
    }
}