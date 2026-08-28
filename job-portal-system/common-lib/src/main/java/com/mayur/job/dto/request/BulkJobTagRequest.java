package com.mayur.job.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BulkJobTagRequest {

    @NotEmpty(message = "Tag list must not be empty")
    @Size(max = 200, message = "Cannot create more than 200 tags in a single request")
    @Valid
    private List<JobTagRequest> tags;
}
