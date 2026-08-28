package com.mayur.job.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BulkJobCategoryRequest {

    @NotEmpty(message = "Category list must not be empty")
    @Size(max = 100, message = "Cannot create more than 100 categories in a single request")
    @Valid
    private List<JobCategoryRequest> categories;
}
