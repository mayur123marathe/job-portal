package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.ai.request.CareerFeedbackRequest;
import com.mayur.job.dto.ai.request.ResumeImprovementRequest;
import com.mayur.job.dto.ai.request.ResumeParseRequest;
import com.mayur.job.dto.ai.request.ResumeSummaryRequest;
import com.mayur.job.dto.ai.request.WorkExperienceBulletRequest;
import com.mayur.job.dto.ai.response.AiTextResponse;
import com.mayur.job.dto.ai.response.CareerFeedbackResponse;
import com.mayur.job.dto.ai.response.ResumeImprovementResponse;
import com.mayur.job.dto.ai.response.ResumeParseResponse;
import com.mayur.job.dto.ai.response.WorkExperienceBulletsResponse;
import com.mayur.job.service.ResumeAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/resume")
@RequiredArgsConstructor
public class AiResumeController {

    private final ResumeAiService resumeAiService;

    /**
     * Phase 2: Generate a professional summary for a resume.
     * Used in resume builder summary section.
     * POST /api/ai/resume/summary
     */
    @PostMapping("/summary")
    public ResponseEntity<ApiResponse<AiTextResponse>> generateSummary(
            @RequestBody ResumeSummaryRequest request) throws Exception {
        AiTextResponse response = resumeAiService.generateProfessionalSummary(request);
        return ResponseEntity.ok(ApiResponse.success("Professional summary generated", response));
    }

    /**
     * Phase 2: Generate polished bullet points from raw work experience description.
     * Used in resume builder work experience section.
     * POST /api/ai/resume/experience-bullets
     */
    @PostMapping("/experience-bullets")
    public ResponseEntity<ApiResponse<WorkExperienceBulletsResponse>> generateBullets(
            @Valid @RequestBody WorkExperienceBulletRequest request) throws Exception {
        WorkExperienceBulletsResponse response = resumeAiService.generateWorkExperienceBullets(request);
        return ResponseEntity.ok(ApiResponse.success("Bullet points generated", response));
    }

    /**
     * Phase 3: Parse a raw resume text into structured data.
     * Called by resume-service when processing a ResumeParseJob.
     * POST /api/ai/resume/parse
     */
    @PostMapping("/parse")
    public ResponseEntity<ApiResponse<ResumeParseResponse>> parseResume(
            @Valid @RequestBody ResumeParseRequest request) throws Exception {
        ResumeParseResponse response = resumeAiService.parseResume(request);
        return ResponseEntity.ok(ApiResponse.success("Resume parsed successfully", response));
    }

    /**
     * Phase 4: Get specific improvement suggestions for a resume.
     * POST /api/ai/resume/improvements
     */
    @PostMapping("/improvements")
    public ResponseEntity<ApiResponse<ResumeImprovementResponse>> getImprovements(
            @Valid @RequestBody ResumeImprovementRequest request) throws Exception {
        ResumeImprovementResponse response = resumeAiService.getResumeImprovementTips(request);
        return ResponseEntity.ok(ApiResponse.success("Resume improvements analyzed", response));
    }

    /**
     * AI Career Feedback Engine: holistic feedback covering shortlisting issues,
     * improvements, and recommended job targets.
     * POST /api/ai/resume/career-feedback
     */
    @PostMapping("/career-feedback")
    public ResponseEntity<ApiResponse<CareerFeedbackResponse>> getCareerFeedback(
            @Valid @RequestBody CareerFeedbackRequest request) throws Exception {
        CareerFeedbackResponse response = resumeAiService
                .getCareerFeedback(request);
        return ResponseEntity.ok(ApiResponse.success("Career feedback generated", response));
    }
}
