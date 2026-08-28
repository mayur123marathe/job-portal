package com.mayur.job.dto.request;

import com.mayur.job.domain.CompanySize;
import com.mayur.job.domain.CompanyType;
import com.mayur.job.domain.IndustryType;
import com.mayur.job.domain.SocialPlatform;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @Size(max = 200, message = "Tagline must not exceed 200 characters")
    private String tagline;

    private String description;

    private String logoUrl;
    private String coverImageUrl;

    @Pattern(regexp = "^(https?://).*", message = "Website must be a valid URL")
    private String website;

    @Email(message = "Company email must be valid")
    private String email;

    private String phone;

    @Min(value = 1800, message = "Founded year seems too old")
    @Max(value = 2100, message = "Founded year is invalid")
    private Integer foundedYear;

    @NotNull(message = "Company size is required")
    private CompanySize companySize;

    @NotNull(message = "Company type is required")
    private CompanyType companyType;

    @NotNull(message = "Industry type is required")
    private IndustryType industryType;

    /** Official company registration / CIN number for verification. */
    private String registrationNumber;

    private List<SocialLinkEntry> socialLinks;

    // -------------------------------------------------------
    // Nested DTO — keeps the request flat and explicit
    // -------------------------------------------------------

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SocialLinkEntry {
        @NotNull(message = "Platform is required")
        private SocialPlatform platform;

        @NotBlank(message = "URL is required")
        @Pattern(regexp = "^(https?://).*", message = "URL must be valid")
        private String url;
    }
}

