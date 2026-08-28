package com.mayur.job.entity;

import com.mayur.job.domain.AiShortlistStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Full AI screening result for one application.
 * The summary fields (matchedSkills, missingSkills, etc.) are stored as
 * JSON arrays using @ElementCollection so they are queryable if needed.
 *
 * The denormalized aiScore + aiShortlistStatus on the Application entity
 * are kept in sync for fast filtering — this table holds the full detail.
 */
@Entity
@Table(name = "application_screenings",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_screening_application",
                columnNames = "application_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationScreening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false, unique = true)
    private Long applicationId;

    @Column(nullable = false)
    private Integer overallScore;

    @Column
    private Integer skillsMatchScore;

    @Column
    private Integer experienceMatchScore;

    @Column
    private Integer educationMatchScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiShortlistStatus shortlistStatus;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "screening_matched_skills",
            joinColumns = @JoinColumn(name = "screening_id"))
    @Column(name = "skill")
    private List<String> matchedSkills;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "screening_missing_skills",
            joinColumns = @JoinColumn(name = "screening_id"))
    @Column(name = "skill")
    private List<String> missingSkills;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "screening_strengths",
            joinColumns = @JoinColumn(name = "screening_id"))
    @Column(name = "strength", columnDefinition = "TEXT")
    private List<String> strengths;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "screening_concerns",
            joinColumns = @JoinColumn(name = "screening_id"))
    @Column(name = "concern", columnDefinition = "TEXT")
    private List<String> concerns;

    /** True if the job was edited after scoring — score may be outdated. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isStale = false;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime screenedAt;

    /** Identifies which AI prompt version produced this score. */
    @Column(length = 50)
    @Builder.Default
    private String screeningVersion = "v1";
}
