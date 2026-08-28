package com.mayur.job.entity;

import com.mayur.job.domain.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Stores a candidate's overall job-search profile preferences.
 * One row per candidate — candidateId has a unique constraint.
 *
 * Multi-value fields (job types, work modes, etc.) are stored via
 * @ElementCollection so each value gets its own row without a
 * separate entity lifecycle.
 */
@Entity
@Table(
        name = "job_preferences",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_candidate_preference",
                columnNames = "candidate_id"
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // -------------------------------------------------------
    // Cross-service reference
    // -------------------------------------------------------

    @Column(name = "candidate_id", nullable = false, unique = true)
    private Long candidateId;

    // -------------------------------------------------------
    // Availability
    // -------------------------------------------------------

    /** Whether the candidate is actively open to new opportunities. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isOpenToWork = false;

    /** Days of notice required before starting; 0 means immediately available. */
    private Integer noticePeriodDays;

    @Column(nullable = false)
    @Builder.Default
    private Boolean willingToRelocate = false;

    // -------------------------------------------------------
    // Desired role criteria
    // -------------------------------------------------------

    /** Free-text desired job titles, e.g. "Senior Java Developer". */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "preference_desired_titles",
            joinColumns = @JoinColumn(name = "preference_id")
    )
    @Column(name = "job_title")
    @Builder.Default
    private List<String> desiredJobTitles = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "preference_job_types",
            joinColumns = @JoinColumn(name = "preference_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    @Builder.Default
    private List<JobType> desiredJobTypes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "preference_work_modes",
            joinColumns = @JoinColumn(name = "preference_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", nullable = false)
    @Builder.Default
    private List<WorkMode> desiredWorkModes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "preference_experience_levels",
            joinColumns = @JoinColumn(name = "preference_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", nullable = false)
    @Builder.Default
    private List<ExperienceLevel> desiredExperienceLevels = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "preference_industries",
            joinColumns = @JoinColumn(name = "preference_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "industry", nullable = false)
    @Builder.Default
    private List<IndustryType> desiredIndustries = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "preference_company_sizes",
            joinColumns = @JoinColumn(name = "preference_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "company_size", nullable = false)
    @Builder.Default
    private List<CompanySize> preferredCompanySizes = new ArrayList<>();

    // -------------------------------------------------------
    // Preferred locations
    // -------------------------------------------------------

    /** City or country names the candidate is open to. */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "preference_locations",
            joinColumns = @JoinColumn(name = "preference_id")
    )
    @Column(name = "location")
    @Builder.Default
    private List<String> preferredLocations = new ArrayList<>();

    // -------------------------------------------------------
    // Salary expectation
    // -------------------------------------------------------

    private BigDecimal minExpectedSalary;

    private BigDecimal maxExpectedSalary;

    @Column(length = 3)
    @Builder.Default
    private String expectedSalaryCurrency = "INR";

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SalaryPeriod expectedSalaryPeriod = SalaryPeriod.YEARLY;

    // -------------------------------------------------------
    // Timestamps
    // -------------------------------------------------------

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
