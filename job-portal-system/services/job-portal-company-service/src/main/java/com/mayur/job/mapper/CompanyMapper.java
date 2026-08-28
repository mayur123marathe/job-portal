package com.mayur.job.mapper;

//import com.mayur.job.dto.response.CompanyLocationResponse;
import com.mayur.job.dto.response.CompanyResponse;
//import com.mayur.job.common.dto.response.CompanySummaryResponse;
import com.mayur.job.dto.response.SocialLinkResponse;
import com.mayur.job.model.Company;
//import com.mayur.job.entity.CompanyLocation;
import com.mayur.job.model.SocialLink;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class CompanyMapper {

    private CompanyMapper() {}

    // ── Location ──────────────────────────────────────────────────────────────





    // ── Social link ───────────────────────────────────────────────────────────

    private static SocialLinkResponse toSocialLinkResponse(SocialLink sl) {
        return SocialLinkResponse.builder()
                .platform(sl.getPlatform())
                .url(sl.getUrl())
                .build();
    }

    // ── Company ───────────────────────────────────────────────────────────────

    public static CompanyResponse toResponse(
            Company company
    ) {
        List<SocialLinkResponse> socialLinks = company.getSocialLinks() == null
                ? Collections.emptyList()
                : company.getSocialLinks().stream()
                .map(CompanyMapper::toSocialLinkResponse)
                .collect(Collectors.toList());

        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .slug(company.getSlug())
                .tagline(company.getTagline())
                .description(company.getDescription())
                .logoUrl(company.getLogoUrl())
                .coverImageUrl(company.getCoverImageUrl())
                .website(company.getWebsite())
                .email(company.getEmail())
                .phone(company.getPhone())
                .foundedYear(company.getFoundedYear())
                .companySize(company.getCompanySize())
                .companyType(company.getCompanyType())
                .industryType(company.getIndustryType())
                .status(company.getStatus())
                .verified(company.getVerified())
                .active(company.getActive())
                .ownerId(company.getOwnerId())
                .socialLinks(socialLinks)

                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .verifiedAt(company.getVerifiedAt())
                .build();
    }

    public static CompanyResponse toSummaryResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .slug(company.getSlug())
                .logoUrl(company.getLogoUrl())
                .tagline(company.getTagline())
                .industryType(company.getIndustryType())
                .companySize(company.getCompanySize())
                .verified(company.getVerified())

                .build();
    }
}
