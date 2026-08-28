package com.mayur.job.modal.embeddable;

import jakarta.persistence.Embeddable;
import lombok.*;

/**
 * Contact and identity information embedded directly in Resume.
 * Always loaded with the Resume — no independent lifecycle.
 *
 * Separate from the User entity so each resume version can have
 * a slightly different headline or contact preference
 * (e.g. a candidate may show a different email on a creative resume vs a tech resume).
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalInfo {

    private String firstName;
    private String lastName;

    /** One-line professional title, e.g. "Senior Backend Engineer". */
    private String headline;

    private String email;
    private String phone;
    private String city;
    private String country;

    private String profileImage;

    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String websiteUrl;
}
