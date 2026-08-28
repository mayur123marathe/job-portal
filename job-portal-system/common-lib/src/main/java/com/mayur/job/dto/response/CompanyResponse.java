package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Combined Company Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyResponse {

    // Basic
    private Long id;
    private String name;
    private String slug;
    private String tagline;
    private String description;

    // Branding
    private String logoUrl;
    private String coverImageUrl;

    // Contact
    private String website;
    private String email;
    private String phone;

    // Company Info
    private Integer foundedYear;
    private CompanySize companySize;
    private CompanyType companyType;
    private IndustryType industryType;
    private CompanyStatus status;
    private Boolean verified;
    private Boolean active;

    // Summary fields
    private String city;
    private String country;

    // Ownership
    private Long ownerId;

    // Relations
    private List<SocialLinkResponse> socialLinks;
    private List<CompanyLocationResponse> locations;

    // Subscription
    private CompanySubscriptionResponse activeSubscription;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime verifiedAt;
}