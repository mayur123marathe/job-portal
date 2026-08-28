package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HiringInsightsResponse {
    private String overallAssessment;
    private List<String> bottlenecks;
    private List<String> suggestions;
    private String idealCandidateProfile;
    private List<String> screeningCriteria;
    private List<String> keyRedFlags;
    private String marketDemandNote;
}
