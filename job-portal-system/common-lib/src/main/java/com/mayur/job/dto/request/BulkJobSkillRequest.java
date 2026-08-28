package com.mayur.job.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BulkJobSkillRequest {

    @NotEmpty(message = "Skill list must not be empty")
    @Size(max = 200, message = "Cannot create more than 200 skills in a single request")
    @Valid
    private List<JobSkillRequest> skills;
}
