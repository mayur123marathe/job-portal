package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.ai.request.CompanyDescriptionRequest;
import com.mayur.job.dto.ai.request.CompanyTaglineRequest;
import com.mayur.job.dto.ai.response.AiTextResponse;
import com.mayur.job.dto.ai.response.CompanyTaglineResponse;
import com.mayur.job.service.CompanyAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/company")
@RequiredArgsConstructor
public class AiCompanyController {

    private final CompanyAiService companyAiService;

    /**
     * Phase 1: Generate company description for employer profile.
     * Used in CompanyProfile form.
     * POST /api/ai/company/describe
     */
    @PostMapping("/describe")
    public ResponseEntity<ApiResponse<AiTextResponse>> generateCompanyDescription(
            @Valid @RequestBody CompanyDescriptionRequest request) throws Exception {
        AiTextResponse response = companyAiService.generateCompanyDescription(request);
        return ResponseEntity.ok(ApiResponse.success("Company description generated", response));
    }

    /**
     * Phase 1: Generate 3 tagline options for the company.
     * Used in CompanyProfile form.
     * POST /api/ai/company/taglines
     */
    @PostMapping("/taglines")
    public ResponseEntity<ApiResponse<CompanyTaglineResponse>> generateTaglines(
            @Valid @RequestBody CompanyTaglineRequest request) throws Exception {
        CompanyTaglineResponse response = companyAiService.generateCompanyTaglines(request);
        return ResponseEntity.ok(ApiResponse.success("Taglines generated", response));
    }
}
