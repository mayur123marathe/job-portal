package com.mayur.job.dto.resume.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePersonalInfoRequest {

    private String firstName;
    private String lastName;

    @Size(max = 150, message = "Headline must not exceed 150 characters")
    private String headline;

    @Email(message = "Must be a valid email address")
    private String email;

    private String phone;
    private String city;
    private String country;

    private String profileImage;

    @Pattern(regexp = "^(https?://).*", message = "LinkedIn URL must be valid")
    private String linkedinUrl;

    @Pattern(regexp = "^(https?://).*", message = "GitHub URL must be valid")
    private String githubUrl;

    @Pattern(regexp = "^(https?://).*", message = "Portfolio URL must be valid")
    private String portfolioUrl;

    @Pattern(regexp = "^(https?://).*", message = "Website URL must be valid")
    private String websiteUrl;
}
