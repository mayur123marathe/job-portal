package com.mayur.job.modal;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Flexible, user-visible label applied to jobs
 * (e.g. "urgent-hiring", "visa-sponsored", "startup", "equity").
 * Unlike skills, tags are descriptive and not domain-specific.
 */
@Entity
@Table(name = "job_tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String name;

    /** URL-friendly identifier. */
    @Column(unique = true, length = 80)
    private String slug;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
