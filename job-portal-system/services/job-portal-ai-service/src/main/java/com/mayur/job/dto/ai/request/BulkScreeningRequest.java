package com.mayur.job.dto.ai.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BulkScreeningRequest {

    @NotNull
    private String jobTitle;

    private String experienceLevel;

    private List<String> requiredSkills;

    private String responsibilities;

    @NotEmpty
    private List<CandidateScreeningInput> candidates;
}
