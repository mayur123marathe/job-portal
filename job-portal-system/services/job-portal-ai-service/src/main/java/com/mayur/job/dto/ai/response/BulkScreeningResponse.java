package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BulkScreeningResponse {
    private List<CandidateScreeningResult> results;
    private double averageScore;
    private List<String> recommendedForInterview;
}
