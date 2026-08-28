package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobAlertSuggestResponse {

    private List<String> suggestedKeywords;
    private List<String> suggestedLocations;
    private List<String> suggestedJobTypes;
    private List<String> suggestedWorkModes;
    private List<String> suggestedExperienceLevels;
    private List<String> suggestedIndustries;
    private String reasoning;
}
