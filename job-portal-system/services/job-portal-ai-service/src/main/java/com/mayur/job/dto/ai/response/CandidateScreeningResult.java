package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CandidateScreeningResult {
    private String candidateId;
    private String candidateName;
    private int score;
    private String recommendation;   // STRONG_HIRE | HIRE | MAYBE | NO_HIRE
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> strengths;
    private List<String> concerns;
}
