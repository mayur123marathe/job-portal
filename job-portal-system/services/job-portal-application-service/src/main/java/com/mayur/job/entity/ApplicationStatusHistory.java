package com.mayur.job.entity;

import com.mayur.job.domain.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Immutable audit log of every status transition on an application.
 * Records who changed the status, when, and why.
 * Never updated or deleted — append-only for compliance and transparency.
 *
 * Example timeline:
 *   PENDING → REVIEWING      (employer opens application)
 *   REVIEWING → SHORTLISTED  (employer shortlists)
 *   SHORTLISTED → INTERVIEW_SCHEDULED  (interview created)
 *   INTERVIEW_SCHEDULED → HIRED
 */
@Entity
@Table(name = "application_status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    /** null means this is the initial PENDING status on creation. */
    @Enumerated(EnumType.STRING)
    private ApplicationStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus toStatus;

    /**
     * User who triggered the change.
     * Employer ID for most transitions; candidate ID for WITHDRAWN.
     */
    @Column(nullable = false)
    private Long changedByUserId;

    /** Optional note explaining the decision (e.g. "Strong technical background"). */
    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime changedAt;
}
