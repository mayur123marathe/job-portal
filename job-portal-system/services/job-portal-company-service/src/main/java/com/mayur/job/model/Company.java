package com.mayur.job.model;

import com.mayur.job.domain.CompanySize;
import com.mayur.job.domain.CompanyStatus;
import com.mayur.job.domain.CompanyType;
import com.mayur.job.domain.IndustryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String name;

    /** URL-friendly identifier, e.g. "google", "infosys-ltd". */
    @Column(unique = true, length = 180)
    private String slug;

    /** One-liner shown on job cards and search results. */
    @Column(length = 200)
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String logoUrl;
    private String coverImageUrl;
    private String website;

    /** Public contact email for candidates. */
    private String email;
    private String phone;

    private Integer foundedYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanySize companySize;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyType companyType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IndustryType industryType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CompanyStatus status = CompanyStatus.PENDING_VERIFICATION;

    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    private LocalDateTime verifiedAt;

    /** Official registration / CIN number for verification. */
    @Column(unique = true)
    private String registrationNumber;

    /**
     * ID of the employer user who owns this company profile (from user-service).
     * Plain Long — no cross-service FK. Unique: one user can own only one company.
     */
    @Column(nullable = false, unique = true)
    private Long ownerId;

    /**
     * Social and web links (LinkedIn, GitHub, Twitter, etc.).
     * Stored in a separate collection table — no independent lifecycle needed.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "company_social_links",
            joinColumns = @JoinColumn(name = "company_id")
    )
    @Builder.Default
    private List<com.mayur.job.model.SocialLink> socialLinks = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
