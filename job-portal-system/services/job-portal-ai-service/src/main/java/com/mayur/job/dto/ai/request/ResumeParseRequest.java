package com.mayur.job.dto.ai.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResumeParseRequest {

    @NotBlank(message = "Resume text is required")
    private String resumeText;
}
