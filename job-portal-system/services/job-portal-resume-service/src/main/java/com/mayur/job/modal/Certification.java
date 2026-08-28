package com.mayur.job.modal;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    /** e.g. "AWS Certified Solutions Architect – Associate". */
    @Column(nullable = false, length = 200)
    private String name;

    /** e.g. "Amazon Web Services", "Google", "PMI". */
    @Column(nullable = false, length = 150)
    private String issuingOrganization;

    @Column(nullable = false)
    private LocalDate issueDate;

    /** Null means the certification does not expire. */
    private LocalDate expiryDate;

    /** e.g. "SAA-C03-2024-XXXXX". */
    @Column(length = 100)
    private String credentialId;

    /** Public verification URL. */
    private String credentialUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
