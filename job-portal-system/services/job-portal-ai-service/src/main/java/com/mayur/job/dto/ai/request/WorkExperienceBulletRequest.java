package com.mayur.job.dto.ai.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WorkExperienceBulletRequest {

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String company;

    @NotBlank(message = "Raw description is required")
    private String rawDescription;

    private String achievementsHint;
}
