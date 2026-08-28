package com.mayur.job.modal.embeddable;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobLocation {

    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;

    /**
     * Latitude/longitude for geo-based search support (optional).
     */
    private Double latitude;
    private Double longitude;
}
