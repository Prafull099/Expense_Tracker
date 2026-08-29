package com.example.expense_tracker.security;

import com.example.expense_tracker.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Wraps Spring's {@link OAuth2User} together with our own {@link User} entity
 * so that downstream code (success handler, JWT generation) can access both the
 * OAuth2 attributes and the DB-persisted user in one object.
 */
public class CustomOAuth2User implements OAuth2User {

    private final OAuth2User delegate;
    private final User user;

    public CustomOAuth2User(OAuth2User delegate, User user) {
        this.delegate = delegate;
        this.user = user;
    }

    /** Expose the DB-persisted user entity to success handlers / controllers */
    public User getUser() {
        return user;
    }

    /** Returns the email — used as the JWT subject for OAuth2 users */
    public String getEmail() {
        return user.getEmail();
    }

    // ── OAuth2User contract ────────────────────────────────────────────────────

    @Override
    public Map<String, Object> getAttributes() {
        return delegate.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Use the roles stored in our DB, not whatever the OAuth2 provider sends
        return user.getRoles().stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    /** Spring Security uses getName() as the principal identifier */
    @Override
    public String getName() {
        return user.getEmail();
    }
}
