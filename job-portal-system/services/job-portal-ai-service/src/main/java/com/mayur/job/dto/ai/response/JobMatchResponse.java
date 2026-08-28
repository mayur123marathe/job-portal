package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobMatchResponse {

    private int matchScore;
    private List<String> matchedCriteria;
    private List<String> unmatchedCriteria;
    private String recommendation;
    private String summary;
}
