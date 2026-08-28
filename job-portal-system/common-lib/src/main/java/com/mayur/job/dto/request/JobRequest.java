package com.mayur.job.dto.request;

import com.mayur.job.domain.ExperienceLevel;
import com.mayur.job.domain.JobType;
import com.mayur.job.domain.SalaryPeriod;
import com.mayur.job.domain.WorkMode;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String requirements;
    private String responsibilities;
    private String benefits;

    @NotNull(message = "Category is required")
    private Long categoryId;

    /** IDs from the job_skills table. */
    private Set<Long> skillIds;

    /** IDs from the job_tags table. */
    private Set<Long> tagIds;

    // -------------------------------------------------------
    // Location — flattened for simpler API surface
    // -------------------------------------------------------

    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;

    // -------------------------------------------------------
    // Salary — flattened for simpler API surface
    // -------------------------------------------------------

    @DecimalMin(value = "0.0", inclusive = true, message = "Min salary must not be negative")
    private BigDecimal minSalary;

    @DecimalMin(value = "0.0", inclusive = true, message = "Max salary must not be negative")
    private BigDecimal maxSalary;

    /** ISO 4217 currency code, e.g. "USD", "INR". Defaults to "USD". */
    private String currency;

    private SalaryPeriod salaryPeriod;
    private Boolean salaryNegotiable;

    /** If false, salary appears as "Competitive" on the listing. */
    private Boolean salaryDisclosed;

    // -------------------------------------------------------
    // Classification
    // -------------------------------------------------------

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotNull(message = "Work mode is required")
    private WorkMode workMode;

    @NotNull(message = "Experience level is required")
    private ExperienceLevel experienceLevel;

    // -------------------------------------------------------
    // Posting details
    // -------------------------------------------------------

    @Min(value = 1, message = "Openings must be at least 1")
    @Builder.Default
    private Integer openings = 1;

    private LocalDate applicationDeadline;
    private LocalDate expiresAt;
}
