package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchEnhanceResponse {

    private List<String> keywords;
    private List<String> locations;
    private List<String> jobTypes;
    private List<String> workModes;
    private List<String> experienceLevels;
    private Long minSalary;
    private List<String> skills;
}
