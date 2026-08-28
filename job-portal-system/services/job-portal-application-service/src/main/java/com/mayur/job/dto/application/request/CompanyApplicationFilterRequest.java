package com.mayur.job.dto.application.request;

import com.mayur.job.domain.AiShortlistStatus;
import com.mayur.job.domain.ApplicationSource;
import com.mayur.job.domain.ApplicationStatus;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * Optional filters for GET /api/applications/company/{companyId}.
 * All fields are nullable — null means "no filter applied".
 * Spring MVC binds these from query params via @ModelAttribute.
 */
@Data
public class CompanyApplicationFilterRequest {

    /** Narrow results to a single job posting within the company. */
    private Long jobId;

    /** Filter by pipeline stage. */
    private ApplicationStatus status;

    /** Filter by how the candidate submitted (DIRECT, REFERRAL, etc.). */
    private ApplicationSource source;

    /** true = unread only, false = read only, null = all. */
    private Boolean isRead;

    /** true = starred only, false = unstarred only, null = all. */
    private Boolean isStarred;

    /** Return only applications submitted on or after this date (inclusive). */
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate appliedFrom;

    /** Return only applications submitted on or before this date (inclusive). */
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate appliedTo;

    /** Filter by AI shortlist classification (e.g. AUTO_SHORTLISTED). */
    private AiShortlistStatus aiShortlistStatus;

    /** Return only applications with AI score >= this value. */
    private Integer minAiScore;

    /**
     * Sort order for results.
     * AI_SCORE_DESC — highest score first (unscreened last)
     * AI_SCORE_ASC  — lowest score first (unscreened last)
     * null / omitted — newest application first (default)
     */
    private String sortBy;
}
