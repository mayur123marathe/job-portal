package com.mayur.job.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BulkJobRequest {

    @NotEmpty(message = "Job list must not be empty")
    @Size(max = 50, message = "Cannot create more than 50 jobs in a single request")
    @Valid
    private List<JobRequest> jobs;
}
