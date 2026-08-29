package com.example.expense_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    /** JWT Bearer token (null in /auth/me response — no need to re-issue) */
    private String token;
    private String username;
    private String email;
    /** Display name from profile (may be null for old local accounts) */
    private String name;
    /** How the user authenticated: LOCAL | GOOGLE | GITHUB | FACEBOOK */
    private String provider;
}
