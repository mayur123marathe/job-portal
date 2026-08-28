package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.*;
import com.mayur.job.domain.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * Combined Job Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobResponse {

    // Basic
    private Long id;
    private String title;

    // Details
    private String description;
    private String requirements;
    private String responsibilities;
    private String benefits;

    // Company
    private CompanyResponse company;
    private Long companyId;
    private Long employerId;

    // Category
    private JobCategoryResponse category;
    private String categoryName;

    // Skills
    private Set<JobSkillResponse> skills;
    private Set<String> skillNames;

    // Tags
    private Set<JobTagResponse> tags;
    private Set<String> tagNames;

    // Location
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;

    // Salary
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String currency;
    private SalaryPeriod salaryPeriod;
    private Boolean salaryNegotiable;
    private Boolean salaryDisclosed;

    // Classification
    private JobType jobType;
    private WorkMode workMode;
    private ExperienceLevel experienceLevel;
    private JobStatus status;

    // Posting Details
    private Integer openings;
    private LocalDate applicationDeadline;
    private LocalDate expiresAt;
    private Boolean active;

    // Analytics
    private Long viewCount;
    private Long applicationCount;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    private LocalDateTime closedAt;
}