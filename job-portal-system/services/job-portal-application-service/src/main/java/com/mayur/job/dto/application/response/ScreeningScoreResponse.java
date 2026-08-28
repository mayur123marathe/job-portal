package com.mayur.job.dto.application.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

/**
 * Local copy of the AI service's ScreeningScoreResponse — used to deserialize the Feign response.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ScreeningScoreResponse {

    private int score;
    private int skillsMatchScore;
    private int experienceMatchScore;
    private int educationMatchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> strengths;
    private List<String> concerns;
    private String summary;
}
