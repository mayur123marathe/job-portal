package com.mayur.job.dto.ai.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class HiringInsightsRequest {

    @NotNull
    private String jobTitle;

    private String experienceLevel;
    private List<String> requiredSkills;
    private String jobType;

    private Integer applicantCount;
    private Integer pendingCount;
    private Integer shortlistedCount;
    private Integer rejectedCount;
}
