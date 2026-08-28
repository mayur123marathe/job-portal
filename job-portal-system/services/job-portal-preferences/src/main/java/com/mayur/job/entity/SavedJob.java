package com.mayur.job.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * A job bookmarked by a candidate for later review.
 *
 * Unique constraint on (candidateId, jobId) — a candidate cannot
 * save the same job twice.
 *
 * companyId is denormalized here so list queries can filter/display
 * by company without a round-trip to the job-service.
 */
@Entity
@Table(
        name = "saved_jobs",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_candidate_saved_job",
                columnNames = {"candidate_id", "job_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedJob {

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

    /** Denormalized for efficient company-level filtering on saved job lists. */
    @Column(nullable = false)
    private Long companyId;

    // -------------------------------------------------------
    // Candidate-added metadata
    // -------------------------------------------------------

    /** Optional personal note the candidate can attach to a saved job. */
    @Column(columnDefinition = "TEXT")
    private String notes;

    // -------------------------------------------------------
    // Timestamps
    // -------------------------------------------------------

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime savedAt;
}
