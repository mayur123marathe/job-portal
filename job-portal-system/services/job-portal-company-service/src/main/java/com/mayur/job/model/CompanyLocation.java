package com.mayur.job.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * One physical or virtual office location of a company.
 * A company can have multiple locations (HQ, regional offices, remote hubs).
 * Separate entity because each location has its own lifecycle (add / deactivate).
 */
@Entity
@Table(name = "company_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    /**
     * Human-readable label, e.g. "Headquarters", "Engineering Hub", "Sales Office".
     */
    @Column(length = 100)
    private String label;

    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;

    /** Used for geo-based job search radius queries. */
    private Double latitude;
    private Double longitude;

    /** Only one location per company should have this true. */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isHeadquarter = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
}
