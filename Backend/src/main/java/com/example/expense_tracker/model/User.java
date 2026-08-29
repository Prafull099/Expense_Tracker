package com.example.expense_tracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique username — may be null for OAuth2-only users (we use email as lookup key) */
    @Column(unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    /** Null for OAuth2 users (they authenticate via provider, not password) */
    @Column
    private String password;

    /** Display name sourced from the OAuth2 provider profile (e.g. "Prafull Mishra") */
    @Column
    private String name;

    /** Which provider authenticated this user */
    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;

    /** The unique subject ID from the OAuth2 provider (e.g. Google's "sub" claim) */
    @Column
    private String providerId;

    /** Roles for RBAC — stored in a separate join table */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Builder.Default
    private Set<String> roles = new HashSet<>(Set.of("ROLE_USER"));
}
