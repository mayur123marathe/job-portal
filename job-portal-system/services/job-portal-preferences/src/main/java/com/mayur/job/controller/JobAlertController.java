package com.mayur.job.controller;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.response.JobAlertResponse;
import com.mayur.job.dto.preference.request.CreateJobAlertRequest;
import com.mayur.job.dto.preference.request.UpdateJobAlertRequest;
import com.mayur.job.service.JobAlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/preferences/job-alerts")
@RequiredArgsConstructor
public class JobAlertController {

    private final JobAlertService alertService;

    @PostMapping
    public ResponseEntity<JobAlertResponse> createAlert(
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody CreateJobAlertRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alertService.createAlert(candidateId, req));
    }

    @GetMapping
    public ResponseEntity<List<JobAlertResponse>> getMyAlerts(
            @RequestHeader("X-User-Id") Long candidateId) {
        return ResponseEntity.ok(alertService.getMyAlerts(candidateId));
    }

    @GetMapping("/{alertId}")
    public ResponseEntity<JobAlertResponse> getAlertById(
            @PathVariable Long alertId,
            @RequestHeader("X-User-Id") Long candidateId) throws Exception {
        return ResponseEntity.ok(alertService.getAlertById(alertId, candidateId));
    }

    @PutMapping("/{alertId}")
    public ResponseEntity<JobAlertResponse> updateAlert(
            @PathVariable Long alertId,
            @RequestHeader("X-User-Id") Long candidateId,
            @RequestBody UpdateJobAlertRequest req) throws Exception {
        return ResponseEntity.ok(alertService.updateAlert(alertId, candidateId, req));
    }

    @PatchMapping("/{alertId}/toggle")
    public ResponseEntity<JobAlertResponse> toggleAlert(
            @PathVariable Long alertId,
            @RequestHeader("X-User-Id") Long candidateId) throws Exception {
        return ResponseEntity.ok(alertService.toggleAlert(alertId, candidateId));
    }

    @DeleteMapping("/{alertId}")
    public ResponseEntity<ApiResponse> deleteAlert(
            @PathVariable Long alertId,
            @RequestHeader("X-User-Id") Long candidateId) throws Exception {
        alertService.deleteAlert(alertId, candidateId);
        return ResponseEntity.ok(new ApiResponse("Job alert deleted successfully", true));
    }
}
