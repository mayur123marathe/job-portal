package com.mayur.job.entity;

import com.mayur.job.domain.AiShortlistStatus;
import com.mayur.job.domain.ApplicationSource;
import com.mayur.job.domain.ApplicationStatus;
import com.mayur.job.entity.embeddable.ApplicationAttachment;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Core aggregate — one row per (candidate, job) pair.
 * A candidate cannot apply to the same job twice (enforced by unique constraint).
 *
 * Cross-service IDs (jobId, candidateId, companyId, employerId) are plain Longs.
 *
 * Resume snapshot: stored at application time so the employer always sees
 * the resume the candidate submitted, even if they later update their profile.
 */
@Entity
@Table(
        name = "applications",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_candidate_job",
                columnNames = {"candidate_id", "job_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // -------------------------------------------------------
    // Cross-service references (no FK constraints)
    // -------------------------------------------------------

    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    /** Denormalized for fast filtering — avoids Feign call to job-service per row. */
    @Column(nullable = false)
    private Long companyId;

    /** User ID of the employer who posted the job. */
    @Column(nullable = false)
    private Long employerId;

    /** ID of the resume used at application time (from resume-service). */
    @Column(nullable = false)
    private Long resumeId;

    // -------------------------------------------------------
    // Status
    // -------------------------------------------------------

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;



    // -------------------------------------------------------
    // Candidate submission content
    // -------------------------------------------------------

    @Column(columnDefinition = "TEXT")
    private String coverLetter;


    /** Candidate's expected salary — helps employer assess fit quickly. */
    private BigDecimal expectedSalary;


    /** When the candidate is available to start. */
    private LocalDate availableFrom;



    /** True once the employer has opened and read this application. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    /** True if employer has starred/saved this application for later review. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isStarred = false;



    // -------------------------------------------------------
    // AI Screening (denormalized for fast filtering/sorting)
    // -------------------------------------------------------

    /** Overall AI match score 0–100. Null until screening completes. */
    @Column
    private Integer aiScore;

    @Enumerated(EnumType.STRING)
    @Column
    @Builder.Default
    private AiShortlistStatus aiShortlistStatus = AiShortlistStatus.NOT_SCREENED;

    private LocalDateTime withdrawnAt;

    @Column(columnDefinition = "TEXT")
    private String withdrawnReason;



    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime appliedAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
