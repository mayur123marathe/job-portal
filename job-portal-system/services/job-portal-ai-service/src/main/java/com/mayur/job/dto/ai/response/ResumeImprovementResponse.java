package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResumeImprovementResponse {

    private int overallScore;
    private List<Improvement> improvements;
    private List<String> strengths;
    private String summary;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Improvement {
        private String section;
        private String issue;
        private String suggestion;
        private String priority;
    }
}
