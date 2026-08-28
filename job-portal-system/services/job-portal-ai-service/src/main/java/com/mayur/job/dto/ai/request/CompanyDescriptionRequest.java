package com.mayur.job.dto.ai.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyDescriptionRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    private String industry;
    private String companyType;
    private String size;
    private String tagline;
    private String additionalContext;
}
