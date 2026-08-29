package com.example.expense_tracker.service;

import com.example.expense_tracker.model.AuthProvider;
import com.example.expense_tracker.model.User;
import com.example.expense_tracker.repository.UserRepository;
import com.example.expense_tracker.security.CustomOAuth2User;
import com.example.expense_tracker.security.oauth2.OAuth2UserInfo;
import com.example.expense_tracker.security.oauth2.OAuth2UserInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Core OAuth2 user provisioning service.
 *
 * Called by Spring Security after the OAuth2 provider has authenticated the user
 * and returned their profile. This service:
 *   1. Normalises the provider-specific attributes via {@link OAuth2UserInfoFactory}
 *   2. Looks up the user in our DB by providerId (returning user) or email (account linking)
 *   3. Auto-provisions new users on first OAuth2 login
 *   4. Returns a {@link CustomOAuth2User} wrapping both the OAuth2User and our DB User
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                registrationId, oAuth2User.getAttributes());

        String rawEmail = userInfo.getEmail();
        if (rawEmail == null || rawEmail.isBlank()) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("email_not_found"),
                    "Email not returned by " + registrationId + ". " +
                    "Please make your email public on the provider's settings page.");
        }

        String normalizedEmail = rawEmail.trim().toLowerCase();
        AuthProvider provider = AuthProvider.valueOf(registrationId.toUpperCase());
        User user = processUser(userInfo, normalizedEmail, provider);
        return new CustomOAuth2User(oAuth2User, user);
    }

    private User processUser(OAuth2UserInfo userInfo, String normalizedEmail, AuthProvider provider) {
        // 1. Look up by provider + providerId (fastest — returning social-login user)
        Optional<User> byProviderId = userRepository
                .findByProviderAndProviderId(provider, userInfo.getId());
        if (byProviderId.isPresent()) {
            return updateExistingUser(byProviderId.get(), userInfo);
        }

        // 2. Look up by email — handles account linking (user registered locally then logs in via OAuth2)
        Optional<User> byEmail = userRepository.findByEmailIgnoreCase(normalizedEmail);
        if (byEmail.isPresent()) {
            User existing = byEmail.get();
            // Link the OAuth2 provider to the existing account if it was LOCAL
            if (existing.getProvider() != provider) {
                existing.setProvider(provider);
                existing.setProviderId(userInfo.getId());
            }
            return updateExistingUser(existing, userInfo);
        }

        // 3. Brand-new user — auto-register
        return registerNewUser(userInfo, normalizedEmail, provider);
    }

    private User registerNewUser(OAuth2UserInfo userInfo, String normalizedEmail, AuthProvider provider) {
        User newUser = User.builder()
                .name(userInfo.getName())
                .email(normalizedEmail)
                // Use email as username so the existing JWT/UserDetails lookup still works
                .username(normalizedEmail)
                .provider(provider)
                .providerId(userInfo.getId())
                // No password — OAuth2 users authenticate entirely through the provider
                .password(null)
                .build();
        return userRepository.save(newUser);
    }


    private User updateExistingUser(User user, OAuth2UserInfo userInfo) {
        // Keep name / providerId in sync with the provider (e.g. user changed their name on Google)
        user.setName(userInfo.getName());
        if (user.getProviderId() == null) {
            user.setProviderId(userInfo.getId());
        }
        return userRepository.save(user);
    }
}
