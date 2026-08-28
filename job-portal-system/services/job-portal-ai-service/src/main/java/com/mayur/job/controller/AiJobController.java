package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.ai.request.HiringInsightsRequest;
import com.mayur.job.dto.ai.request.JobDescriptionRequest;
import com.mayur.job.dto.ai.request.SalaryRangeRequest;
import com.mayur.job.dto.ai.response.AiTextResponse;
import com.mayur.job.dto.ai.response.HiringInsightsResponse;
import com.mayur.job.dto.ai.response.SalaryRangeResponse;
import com.mayur.job.service.JobAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/job")
@RequiredArgsConstructor
public class AiJobController {

    private final JobAiService jobAiService;

    /**
     * Phase 1: Generate a full professional job description from basic details.
     * Used by employer in the CreateJob form.
     * POST /api/ai/job/describe
     */
    @PostMapping("/describe")
    public ResponseEntity<ApiResponse<AiTextResponse>>
    generateJobDescription(
            @Valid @RequestBody JobDescriptionRequest request) throws Exception {
        AiTextResponse response = jobAiService.generateJobDescription(request);
        return ResponseEntity.ok(ApiResponse.success("Job description generated", response));
    }

    /**
     * Phase 1: Auto-fill responsibilities and requirements based on job title.
     * Used when employer types a job title.
     * GET /api/ai/job/requirements?title=...&category=...
     */
    @GetMapping("/requirements")
    public ResponseEntity<ApiResponse<AiTextResponse>> generateJobRequirements(
            @RequestParam String title,
            @RequestParam(required = false) String category) throws Exception {
        AiTextResponse response = jobAiService.generateJobRequirements(title, category);
        return ResponseEntity.ok(ApiResponse.success("Requirements generated", response));
    }

    /**
     * Phase 1: Suggest salary range for a role.
     * Used in CreateJob salary section.
     * POST /api/ai/job/salary-suggestion
     */
    @PostMapping("/salary-suggestion")
    public ResponseEntity<ApiResponse<SalaryRangeResponse>> suggestSalary(
            @Valid @RequestBody SalaryRangeRequest request) throws Exception {
        SalaryRangeResponse response = jobAiService.suggestSalaryRange(request);
        return ResponseEntity.ok(ApiResponse.success("Salary range suggested", response));
    }

    /**
     * Phase 3: Recommend skills for a job posting.
     * Used when employer fills in job details.
     * GET /api/ai/job/skills-recommendation?title=...&description=...
     */
    @GetMapping("/skills-recommendation")
    public ResponseEntity<ApiResponse<AiTextResponse>> recommendSkills(
            @RequestParam String title,
            @RequestParam(required = false) String description) throws Exception {
        AiTextResponse response = jobAiService
                .recommendSkillsForJob(title, description);
        return ResponseEntity.ok(ApiResponse.success("Skills recommended", response));
    }

    /**
     * Auto-fill responsibilities based on job title.
     * GET /api/ai/job/responsibilities?title=...&category=...
     */
    @GetMapping("/responsibilities")
    public ResponseEntity<ApiResponse<AiTextResponse>> generateResponsibilities(
            @RequestParam String title,
            @RequestParam(required = false) String category) throws Exception {
        AiTextResponse response = jobAiService.generateJobResponsibilities(title, category);
        return ResponseEntity.ok(ApiResponse.success("Responsibilities generated", response));
    }

    /**
     * Auto-fill benefits based on job title and type.
     * GET /api/ai/job/benefits?title=...&category=...&jobType=...
     */
    @GetMapping("/benefits")
    public ResponseEntity<ApiResponse<AiTextResponse>> generateBenefits(
            @RequestParam String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String jobType) throws Exception {
        AiTextResponse response = jobAiService.generateJobBenefits(title, category, jobType);
        return ResponseEntity.ok(ApiResponse.success("Benefits generated", response));
    }

    /**
     * Recommend tags/keywords for job discoverability.
     * GET /api/ai/job/tags-recommendation?title=...&description=...
     */
    @GetMapping("/tags-recommendation")
    public ResponseEntity<ApiResponse<AiTextResponse>> recommendTags(
            @RequestParam String title,
            @RequestParam(required = false) String description) throws Exception {
        AiTextResponse response = jobAiService.recommendTagsForJob(title, description);
        return ResponseEntity.ok(ApiResponse.success("Tags recommended", response));
    }

}
