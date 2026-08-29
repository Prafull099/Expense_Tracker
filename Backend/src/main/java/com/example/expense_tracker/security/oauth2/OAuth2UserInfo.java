package com.example.expense_tracker.security.oauth2;

import java.util.Map;

/**
 * Abstract normalisation layer over the different attribute maps returned by
 * Google, GitHub, and Facebook. Each subclass knows the provider-specific
 * attribute keys and maps them to a common interface.
 */
public abstract class OAuth2UserInfo {

    protected final Map<String, Object> attributes;

    protected OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    /** Provider-specific unique ID (Google "sub", GitHub "id", Facebook "id") */
    public abstract String getId();

    /** Full display name */
    public abstract String getName();

    /** Primary email address */
    public abstract String getEmail();

    /** Profile picture URL (may be null) */
    public abstract String getImageUrl();
}
