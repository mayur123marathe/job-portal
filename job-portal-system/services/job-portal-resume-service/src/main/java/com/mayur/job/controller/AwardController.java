package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.response.AwardResponse;
import com.mayur.job.dto.resume.request.AddAwardRequest;
import com.mayur.job.service.AwardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes/{resumeId}/awards")
@RequiredArgsConstructor
public class AwardController {

    private final AwardService awardService;

    @PostMapping
    public ResponseEntity<AwardResponse> addAward(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid AddAwardRequest req) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(awardService.addAward(resumeId, candidateId, req));
    }

    @GetMapping
    public ResponseEntity<List<AwardResponse>> getAwards(
            @PathVariable Long resumeId) throws Exception {
        return ResponseEntity.ok(awardService.getAwards(resumeId));
    }

    @PutMapping("/{awardId}")
    public ResponseEntity<AwardResponse> updateAward(
            @PathVariable Long resumeId,
            @PathVariable Long awardId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody @Valid AddAwardRequest req) throws Exception {
        return ResponseEntity.ok(awardService.updateAward(awardId, resumeId, candidateId, req));
    }

    @DeleteMapping("/{awardId}")
    public ResponseEntity<ApiResponse> deleteAward(
            @PathVariable Long resumeId,
            @PathVariable Long awardId,
            @RequestHeader("X-User-Id") Long candidateId) throws Exception {
        awardService.deleteAward(awardId, resumeId, candidateId);
        return ResponseEntity.ok(new ApiResponse("Award deleted successfully", true));
    }
}
