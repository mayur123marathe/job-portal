package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Lightweight job card response — used in application cards and list views.
 * Omits heavy text fields (description, requirements, etc.) to reduce payload.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobSummaryResponse {

    private Long id;
    private String title;
    private Long companyId;

    // Location
    private String city;
    private String country;

    // Salary
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String currency;
    private Boolean salaryDisclosed;

    // Classification
    private JobType jobType;
    private WorkMode workMode;
    private ExperienceLevel experienceLevel;
    private JobStatus status;

    // Taxonomy
    private String categoryName;
    private Set<String> skillNames;
    private Set<String> tagNames;

    // Posting details
    private Integer openings;
    private Long applicationCount;
    private LocalDate applicationDeadline;

    private LocalDateTime createdAt;
}
