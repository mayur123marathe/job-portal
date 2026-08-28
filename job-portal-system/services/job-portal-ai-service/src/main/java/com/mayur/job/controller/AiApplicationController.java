package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.ai.request.BulkScreeningRequest;
import com.mayur.job.dto.ai.request.CoverLetterRequest;
import com.mayur.job.dto.ai.request.InterviewQuestionsRequest;
import com.mayur.job.dto.ai.request.ScreeningScoreRequest;
import com.mayur.job.dto.ai.request.SkillsGapRequest;
import com.mayur.job.dto.ai.response.AiTextResponse;
import com.mayur.job.dto.ai.response.BulkScreeningResponse;
import com.mayur.job.dto.ai.response.InterviewQuestionsResponse;
import com.mayur.job.dto.ai.response.ScreeningScoreResponse;
import com.mayur.job.dto.ai.response.SkillsGapResponse;
import com.mayur.job.service.ApplicationAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai/application")
@RequiredArgsConstructor
public class AiApplicationController {

    private final ApplicationAiService applicationAiService;

    /**
     * Phase 2: Generate a personalized cover letter for a job application.
     * Called from the Apply Job form on the frontend.
     * POST /api/ai/application/cover-letter
     */
    @PostMapping("/cover-letter")
    public ResponseEntity<ApiResponse<AiTextResponse>> generateCoverLetter(
            @Valid @RequestBody CoverLetterRequest request) throws Exception {
        AiTextResponse response = applicationAiService.generateCoverLetter(request);
        return ResponseEntity.ok(ApiResponse.success("Cover letter generated", response));
    }

    /**
     * Phase 3: Score a candidate's application against job requirements.
     * Used by employer in the Applications page to see AI match score.
     * POST /api/ai/application/screening-score
     */
    @PostMapping("/screening-score")
    public ResponseEntity<ApiResponse<ScreeningScoreResponse>> scoreCandidate(
            @RequestBody ScreeningScoreRequest request) throws Exception {
        ScreeningScoreResponse response = applicationAiService.scoreCandidate(request);
        return ResponseEntity.ok(ApiResponse.success("Candidate screened", response));
    }



    /**
     * Phase 4: Analyze skills gap between candidate and job requirements.
     * Used by candidate in JobDetails page.
     * POST /api/ai/application/skills-gap
     */
    @PostMapping("/skills-gap")
    public ResponseEntity<ApiResponse<SkillsGapResponse>> analyzeSkillsGap(
            @Valid @RequestBody SkillsGapRequest request) throws Exception {
        SkillsGapResponse response = applicationAiService.analyzeSkillsGap(request);
        return ResponseEntity.ok(ApiResponse.success("Skills gap analyzed", response));
    }

    /**
     * Phase 3: Summarize all recruiter notes for an application (TL;DR).
     * Used by employer in the Application detail view.
     * POST /api/ai/application/summarize-notes
     */
    @PostMapping("/summarize-notes")
    public ResponseEntity<ApiResponse<AiTextResponse>> summarizeNotes(
            @RequestBody List<String> notes) throws Exception {
        AiTextResponse response = applicationAiService.summarizeApplicationNotes(notes);
        return ResponseEntity.ok(ApiResponse.success("Notes summarized", response));
    }


}
