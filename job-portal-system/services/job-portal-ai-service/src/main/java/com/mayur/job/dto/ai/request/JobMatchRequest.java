package com.mayur.job.dto.ai.request;

import lombok.Data;

import java.util.List;

@Data
public class JobMatchRequest {

    // Candidate preferences
    private List<String> preferredWorkModes;
    private List<String> preferredJobTypes;
    private Long minSalary;
    private List<String> preferredIndustries;
    private String candidateExperienceLevel;
    private List<String> candidateSkills;

    // Job details
    private String jobTitle;
    private String workMode;
    private String jobType;
    private Long salaryMin;
    private Long salaryMax;
    private String currency;
    private String industry;
    private String jobExperienceLevel;
    private List<String> jobSkills;
}
