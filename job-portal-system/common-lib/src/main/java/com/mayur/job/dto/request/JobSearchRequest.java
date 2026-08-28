package com.mayur.job.dto.request;

import com.mayur.job.domain.ExperienceLevel;
import com.mayur.job.domain.JobStatus;
import com.mayur.job.domain.JobType;
import com.mayur.job.domain.WorkMode;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Holds all optional search and filter parameters for GET /api/jobs.
 * Every field is optional — null means "no filter applied".
 * Spring MVC binds this automatically via @ModelAttribute (query params).
 *
 * Search (LIKE across multiple fields):
 *   keyword  → title, description, skill names, tag names
 *
 * Filters (exact/range match):
 *   categoryId, skillIds, tagIds, companyId
 *   location (matches city, state, or country)
 *   minSalary / maxSalary (salary range overlap)
 *   jobType, workMode, status
 *   minOpenings / maxOpenings
 */
@Data
public class JobSearchRequest {

    // ── Full-text search ──────────────────────────────────────────────────────

    /** Searches across: title, description, skill names, tag names. */
    private String keyword;

    // ── Filters ───────────────────────────────────────────────────────────────

    private Long categoryId;

    /** Filter jobs that have ANY of these skill IDs. */
    private List<Long> skillIds;

    /** Filter jobs that have ANY of these tag IDs. */
    private List<Long> tagIds;

    private Long companyId;

    /** Matches city, state, or country (case-insensitive LIKE). */
    private String location;

    /** Salary overlap — job's max salary must be >= minSalary. */
    private BigDecimal minSalary;

    /** Salary overlap — job's min salary must be <= maxSalary. */
    private BigDecimal maxSalary;

    private JobType jobType;

    private WorkMode workMode;

    private ExperienceLevel experienceLevel;

    /** Defaults to OPEN in the service when null. */
    private JobStatus status;

    private Integer minOpenings;
    private Integer maxOpenings;
}
