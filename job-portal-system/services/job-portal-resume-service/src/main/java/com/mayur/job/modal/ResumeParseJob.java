package com.mayur.job.modal;

import com.mayur.job.domain.ParseStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Tracks the lifecycle of an async resume parsing request.
 *
 * Flow:
 *   1. Candidate uploads PDF/DOCX → ResumeParseJob created (PENDING).
 *   2. Parser worker picks it up → status → PROCESSING.
 *   3a. Success → extractedText + parsedData (JSON) stored → status → COMPLETED.
 *       Candidate reviews the pre-filled builder and saves as a Resume.
 *       resumeId is set once the candidate confirms the parsed data.
 *   3b. Failure → failureReason stored → status → FAILED.
 *
 * parsedData stores a JSON snapshot of what the parser extracted
 * (sections, dates, skill names) before it is mapped into proper entities.
 */
@Entity
@Table(name = "resume_parse_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeParseJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long candidateId;

    /**
     * Set once the candidate confirms the parsed data and a Resume entity
     * is created from it. Null until then.
     */
    private Long resumeId;

    @Column(nullable = false)
    private String originalFileUrl;

    @Column(nullable = false, length = 250)
    private String originalFileName;

    /** "PDF", "DOC", "DOCX". */
    @Column(nullable = false, length = 10)
    private String fileType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ParseStatus status = ParseStatus.PENDING;

    /** Raw text extracted from the file before structured parsing. */
    @Column(columnDefinition = "TEXT")
    private String extractedText;

    /**
     * Structured parse result as JSON.
     * e.g. { "personalInfo": {...}, "workExperiences": [...], "skills": [...] }
     * Consumed by the frontend to pre-fill the builder UI.
     */
    @Column(columnDefinition = "TEXT")
    private String parsedData;

    /** Reason populated when status = FAILED. */
    @Column(columnDefinition = "TEXT")
    private String failureReason;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
