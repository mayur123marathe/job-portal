package com.mayur.job.modal;

import com.mayur.job.domain.ResumeTemplate;
import com.mayur.job.domain.ResumeVisibility;
import com.mayur.job.modal.embeddable.PersonalInfo;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Top-level resume document. One candidate can own multiple versions
 * (e.g. "Backend Engineer Resume", "Product Manager Resume").
 *
 * Sections (WorkExperience, Education, etc.) are separate entities
 * that reference this Resume — independently added, edited, removed,
 * and drag-drop reordered via their displayOrder field.
 *
 * candidateId is a plain Long — no cross-service FK.
 */
@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Owner of this resume (from user-service). */
    @Column(nullable = false)
    private Long candidateId;

    /** Friendly name to distinguish multiple versions. */
    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResumeTemplate template = ResumeTemplate.PROFESSIONAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ResumeVisibility visibility = ResumeVisibility.PRIVATE;

    /**
     * When true, this resume is auto-selected when the candidate applies to a job
     * without explicitly choosing a version. Only one resume per candidate can be default.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    // -------------------------------------------------------
    // Contact & identity (embedded — always loaded together)
    // -------------------------------------------------------

    @Embedded
    private PersonalInfo personalInfo;

    /** Professional summary / objective paragraph. */
    @Column(columnDefinition = "TEXT")
    private String summary;

    // -------------------------------------------------------
    // Uploaded file (optional — for upload-based resumes)
    // -------------------------------------------------------

    /**
     * URL of the original uploaded file (PDF / DOCX).
     * Null for resumes built entirely through the builder UI.
     */
    private String uploadedFileUrl;
    private String uploadedFileName;

    // -------------------------------------------------------
    // Metadata
    // -------------------------------------------------------

    /**
     * 0–100 score indicating how complete the resume is.
     * Computed and updated by the service after each section change.
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer completionScore = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    /** Timestamp of last employer view — used for "Resume viewed" notifications. */
    private LocalDateTime lastViewedAt;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
