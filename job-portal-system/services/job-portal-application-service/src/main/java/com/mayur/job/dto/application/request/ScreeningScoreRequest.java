package com.mayur.job.dto.application.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Local copy of the AI service's ScreeningScoreRequest — used by AiClient Feign call.
 */
@Data
@Builder
public class ScreeningScoreRequest {

    private String jobTitle;
    private String experienceLevel;
    private List<String> requiredSkills;
    private String responsibilities;

    private String candidateSummary;
    private List<String> candidateSkills;
    private List<String> candidateExperience;
    private List<String> candidateEducation;
}
