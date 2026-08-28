package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.response.JobResponse;
import com.mayur.job.dto.response.JobSummaryResponse;
import com.mayur.job.dto.request.AiSearchRequest;
import com.mayur.job.dto.request.BulkJobRequest;
import com.mayur.job.dto.request.JobRequest;
import com.mayur.job.dto.request.JobSearchRequest;
import com.mayur.job.dto.response.BulkJobResponse;
import com.mayur.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // ── Create ────────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @RequestHeader("X-User-Id") Long employerId,
            @RequestBody @Valid JobRequest req)
            throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobService.createJob(employerId, req));
    }

    /**
     * Bulk create up to 50 jobs in a single request.
     * Partial-success: each job is saved independently.
     * If some fail, the rest still succeed.
     *
     * POST /api/jobs/bulk
     * Body: { "jobs": [ { ...JobRequest... }, ... ] }
     */
    @PostMapping("/bulk")
    public ResponseEntity<BulkJobResponse> createJobsBulk(
            @RequestHeader("X-User-Id") Long employerId,
            @RequestBody @Valid BulkJobRequest req) {
        return ResponseEntity.status(HttpStatus.MULTI_STATUS)
                .body(jobService.createJobsBulk(employerId, req));
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id) throws Exception {
        jobService.incrementViewCount(id);
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    /** Internal endpoint — used by other services via Feign to get a lightweight job card. */
    @GetMapping("/{id}/summary")
    public ResponseEntity<JobResponse> getJobSummaryById(
            @PathVariable Long id) throws Exception {
        return ResponseEntity.ok(jobService.getJobSummaryById(id));
    }

    /**
     * Unified search + filter endpoint. All params are optional.
     * No params → returns all OPEN active jobs.
     *
     * Search:  ?keyword=java
     * Filters: ?categoryId=1 &skillIds=2&skillIds=5 &tagIds=3
     *          &companyId=10 &location=bangalore
     *          &minSalary=50000 &maxSalary=200000
     *          &jobType=FULL_TIME &workMode=REMOTE &status=OPEN
     *          &minOpenings=1 &maxOpenings=5
     */
    @GetMapping
    public ResponseEntity<List<JobResponse>> getJobs(
            @ModelAttribute JobSearchRequest req) {
        return ResponseEntity.ok(jobService.getJobs(req));
    }

    /**
     * AI semantic search — describe what you're looking for in natural language.
     * Optional hard filters (jobType, workMode, location) can be included to narrow results.
     *
     * POST /api/jobs/search
     * Body: { "query": "React developer remote startup 80k+", "jobType": "FULL_TIME" }
     */
    @PostMapping("/search")
    public ResponseEntity<List<JobResponse>> aiSearch(
            @RequestBody @Valid AiSearchRequest req) {
        return ResponseEntity.ok(jobService.aiSearch(req));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobResponse>> getJobsByCompany(
            @PathVariable Long companyId) {
        return ResponseEntity.ok(jobService.getJobsByCompany(companyId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<JobResponse>> getMyJobs(
            @RequestHeader("X-User-Id") Long employerId) {
        return ResponseEntity.ok(jobService.getJobsByEmployer(employerId));
    }

    /** Admin: all jobs regardless of status/active (gateway ensures ROLE_ADMIN). */
    @GetMapping("/admin")
    public ResponseEntity<List<JobResponse>> getAllJobsAdmin() {
        return ResponseEntity.ok(jobService.getAllJobsAdmin());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<JobResponse>> getJobsByCategory(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(jobService.getJobsByCategory(categoryId));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId,
            @RequestBody @Valid JobRequest req)
            throws Exception {
        return ResponseEntity.ok(jobService.updateJob(id, employerId, req));
    }

    // ── Status transitions ────────────────────────────────────────────────────

    @PatchMapping("/{id}/publish")
    public ResponseEntity<JobResponse> publishJob(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId)
            throws Exception {
        return ResponseEntity.ok(jobService.publishJob(id, employerId));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<JobResponse> closeJob(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId)
            throws Exception {
        return ResponseEntity.ok(jobService.closeJob(id, employerId));
    }

    // ── Internal (inter-service) ──────────────────────────────────────────────

    @PatchMapping("/{id}/increment-applications")
    public ResponseEntity<ApiResponse> incrementApplicationCount(
            @PathVariable Long id) throws Exception {
        jobService.incrementApplicationCount(id);
        return ResponseEntity.ok(new ApiResponse("Application count updated", true));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteJob(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long employerId)
            throws Exception {
        jobService.deleteJob(id, employerId);
        return ResponseEntity.ok(new ApiResponse("Job deleted successfully", true));
    }
}
