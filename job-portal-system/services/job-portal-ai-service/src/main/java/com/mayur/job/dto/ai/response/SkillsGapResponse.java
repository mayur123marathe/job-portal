package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SkillsGapResponse {

    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> partialMatch;
    private List<String> prioritySkillsToLearn;
    private List<LearningRecommendation> learningRecommendations;
    private String overallReadiness;
    private String summary;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LearningRecommendation {
        private String skill;
        private String why;
        private String howToLearn;
    }
}
