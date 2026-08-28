package com.mayur.job.modal;

import com.mayur.job.domain.ExperienceLevel;
import com.mayur.job.domain.JobStatus;
import com.mayur.job.domain.JobType;
import com.mayur.job.domain.WorkMode;
import com.mayur.job.modal.embeddable.JobLocation;
import com.mayur.job.modal.embeddable.SalaryRange;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    // -------------------------------------------------------
    // Cross-service references — stored as plain IDs (no FK)
    // -------------------------------------------------------

    /** ID of the company that posted this job (from company-service). */
    @Column(nullable = false)
    private Long companyId;

    /** ID of the employer/user who created this posting (from user-service). */
    @Column(nullable = false)
    private Long employerId;

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private JobCategory category;

    /**
     * Required skills for this job.
     * Join table: job_skill_mapping(job_id, skill_id).
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "job_skill_mapping",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<JobSkill> skills = new HashSet<>();

    /**
     * Descriptive tags attached to this job.
     * Join table: job_tag_mapping(job_id, tag_id).
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "job_tag_mapping",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<JobTag> tags = new HashSet<>();

    // -------------------------------------------------------
    // Embedded value objects
    // -------------------------------------------------------

    @Embedded
    private JobLocation location;

    @Embedded
    private SalaryRange salaryRange;

    // -------------------------------------------------------
    // Job classification
    // -------------------------------------------------------

    /** Employment type: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobType jobType;

    /** Physical arrangement: REMOTE, HYBRID, ON_SITE. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkMode workMode;

    /** Seniority expected from the candidate. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExperienceLevel experienceLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JobStatus status = JobStatus.DRAFT;

    // -------------------------------------------------------
    // Posting details
    // -------------------------------------------------------

    /** Number of open positions for this role. */
    @Column(nullable = false)
    @Builder.Default
    private Integer openings = 1;

    /** Last date candidates can apply. */
    private LocalDate applicationDeadline;

    /** When the posting should auto-expire (system enforced). */
    private LocalDate expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    // -------------------------------------------------------
    // Analytics counters (denormalized for performance)
    // -------------------------------------------------------

    @Column(nullable = false)
    @Builder.Default
    private Long viewCount = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long applicationCount = 0L;

    // -------------------------------------------------------
    // Timestamps
    // -------------------------------------------------------

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime publishedAt;
    private LocalDateTime closedAt;
}
