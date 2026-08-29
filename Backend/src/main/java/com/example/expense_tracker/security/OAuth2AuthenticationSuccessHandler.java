package com.example.expense_tracker.security;

import com.example.expense_tracker.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

/**
 * Invoked by Spring Security when OAuth2 login succeeds.
 *
 * Flow:
 *   1. Extract the {@link CustomOAuth2User} from the authentication
 *   2. Generate a JWT for that user (same JWT issued for username/password login)
 *   3. Redirect the browser to the frontend with the token in the query string
 *      → http://localhost:5173/oauth2/redirect?token=<JWT>
 *   4. Clear the short-lived OAuth2 state cookie
 */
@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private HttpCookieOAuth2AuthorizationRequestRepository cookieRepository;

    @Value("${app.oauth2.redirectUri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        String targetUrl = determineTargetUrl(authentication);

        // Clean up the OAuth2 state cookie — it's no longer needed
        cookieRepository.removeAuthorizationRequest(request, response);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Cannot redirect to " + targetUrl);
            return;
        }

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String determineTargetUrl(Authentication authentication) {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(
                oAuth2User.getEmail(),
                oAuth2User.getUser().getRoles()
        );

        return UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build()
                .toUriString();
    }
}
