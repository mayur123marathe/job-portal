package com.mayur.job.dto.ai.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResumeImprovementRequest {

    @NotBlank(message = "Resume content is required")
    private String resumeContent;

    private String targetJobTitle;
}
