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
 * A saved search that automatically notifies a candidate when new jobs
 * matching their criteria are posted.
 *
 * Criteria fields are a mix of:
 *  - keywords   : free-text search term
 *  - enum lists : job types, work modes, experience levels, industries
 *  - location list : city / country strings
 *  - salary floor : minimum acceptable salary
 *
 * Scheduling state (lastTriggeredAt, nextScheduledAt) is managed by
 * the alert-dispatcher background job.
 */
@Entity
@Table(name = "job_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // -------------------------------------------------------
    // Cross-service reference
    // -------------------------------------------------------

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    // -------------------------------------------------------
    // Alert identity
    // -------------------------------------------------------

    /** User-facing name, e.g. "Remote Java Jobs in Bangalore". */
    @Column(nullable = false)
    private String alertName;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AlertFrequency frequency = AlertFrequency.DAILY;

    // -------------------------------------------------------
    // Search criteria
    // -------------------------------------------------------

    /** Free-text keywords matched against job title and description. */
    private String keywords;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "alert_locations",
            joinColumns = @JoinColumn(name = "alert_id")
    )
    @Column(name = "location")
    @Builder.Default
    private List<String> locations = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "alert_job_types",
            joinColumns = @JoinColumn(name = "alert_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false)
    @Builder.Default
    private List<JobType> jobTypes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "alert_work_modes",
            joinColumns = @JoinColumn(name = "alert_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "work_mode", nullable = false)
    @Builder.Default
    private List<WorkMode> workModes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "alert_experience_levels",
            joinColumns = @JoinColumn(name = "alert_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", nullable = false)
    @Builder.Default
    private List<ExperienceLevel> experienceLevels = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "alert_industries",
            joinColumns = @JoinColumn(name = "alert_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "industry", nullable = false)
    @Builder.Default
    private List<IndustryType> industries = new ArrayList<>();

    /** Minimum salary filter. Null = no minimum. */
    private BigDecimal minSalary;

    @Column(length = 3)
    @Builder.Default
    private String salaryCurrency = "INR";

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SalaryPeriod salaryPeriod = SalaryPeriod.YEARLY;

    // -------------------------------------------------------
    // Scheduling state (managed by alert dispatcher)
    // -------------------------------------------------------

    /** Timestamp of the most recent dispatch run for this alert. */
    private LocalDateTime lastTriggeredAt;

    /** When the dispatcher should next evaluate this alert. */
    private LocalDateTime nextScheduledAt;

    /** Running count of total job matches sent to the candidate. */
    @Column(nullable = false)
    @Builder.Default
    private Integer totalMatchesSent = 0;

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
