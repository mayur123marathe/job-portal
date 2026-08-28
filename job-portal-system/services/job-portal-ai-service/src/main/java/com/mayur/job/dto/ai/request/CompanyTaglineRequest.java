package com.mayur.job.dto.ai.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyTaglineRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    private String industry;
    private String description;
}
