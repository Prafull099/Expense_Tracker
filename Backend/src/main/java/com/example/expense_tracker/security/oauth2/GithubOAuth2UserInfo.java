package com.example.expense_tracker.security.oauth2;

import java.util.Map;

/**
 * GitHub's userinfo endpoint (/user) returns:
 *   id (integer), login, name, email (may be null if user has hidden their email),
 *   avatar_url, html_url, etc.
 *
 * When email is private/null we construct a GitHub no-reply address as fallback,
 * which is functionally unique and avoids null-pointer issues downstream.
 */
public class GithubOAuth2UserInfo extends OAuth2UserInfo {

    public GithubOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return attributes.get("id").toString();
    }

    @Override
    public String getName() {
        String name = (String) attributes.get("name");
        // Fallback to GitHub login handle if display name is not set
        return (name != null && !name.isBlank()) ? name : (String) attributes.get("login");
    }

    @Override
    public String getEmail() {
        String email = (String) attributes.get("email");
        if (email == null || email.isBlank()) {
            // GitHub noreply format — unique per user, never conflicts with real emails
            return getId() + "+noreply@users.noreply.github.com";
        }
        return email;
    }

    @Override
    public String getImageUrl() {
        return (String) attributes.get("avatar_url");
    }
}
