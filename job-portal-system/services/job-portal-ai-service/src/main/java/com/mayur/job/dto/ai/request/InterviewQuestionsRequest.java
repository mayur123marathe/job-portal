package com.mayur.job.dto.ai.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InterviewQuestionsRequest {

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String experienceLevel;
    private String interviewType;
    private String jobDescription;
}
