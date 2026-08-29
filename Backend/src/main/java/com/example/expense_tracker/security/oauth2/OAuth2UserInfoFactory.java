package com.example.expense_tracker.security.oauth2;

import java.util.Map;

/**
 * Factory that returns the correct {@link OAuth2UserInfo} implementation based
 * on the OAuth2 registration ID (i.e. the provider name configured in
 * application.properties: "google", "github", "facebook").
 */
public class OAuth2UserInfoFactory {

    private OAuth2UserInfoFactory() { /* static utility — not instantiable */ }

    public static OAuth2UserInfo getOAuth2UserInfo(String registrationId,
                                                   Map<String, Object> attributes) {
        return switch (registrationId.toLowerCase()) {
            case "google"   -> new GoogleOAuth2UserInfo(attributes);
            case "github"   -> new GithubOAuth2UserInfo(attributes);
            case "facebook" -> new FacebookOAuth2UserInfo(attributes);
            default -> throw new IllegalArgumentException(
                    "Unsupported OAuth2 provider: " + registrationId);
        };
    }
}
