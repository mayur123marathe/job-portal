package com.mayur.job.dto.ai.request;

import lombok.Data;

import java.util.List;

@Data
public class CandidateScreeningInput {
    private String candidateId;
    private String candidateName;
    private String summary;
    private List<String> skills;
    private List<String> experience;
}
