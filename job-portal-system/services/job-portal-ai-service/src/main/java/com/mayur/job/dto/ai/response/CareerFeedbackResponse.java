package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CareerFeedbackResponse {

    /** 0-100 overall profile strength score */
    private int profileStrength;

    /** Why the candidate is likely not getting shortlisted */
    private List<String> shortlistingIssues;

    /** Specific actionable improvements */
    private List<Improvement> improvements;

    /** Job roles the candidate should be targeting right now */
    private List<JobTarget> targetJobs;

    /** 2-3 sentence overall career advice summary */
    private String overallSummary;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Improvement {
        private String area;        // e.g. "Skills", "Summary", "Experience"
        private String issue;       // what is weak or missing
        private String action;      // concrete step to fix it
        private String priority;    // HIGH | MEDIUM | LOW
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class JobTarget {
        private String jobTitle;    // e.g. "Junior Frontend Developer"
        private String reason;      // why this role fits the profile
        private String skillMatch;  // HIGH | MEDIUM | LOW
    }
}
