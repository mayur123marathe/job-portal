package com.mayur.job.client;

import com.mayur.job.dto.response.ResumeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "job-portal-resume-service")
public interface ResumeClient {

    @GetMapping("/api/resumes/{id}")
    ResumeResponse getResumeById(@PathVariable("id") Long id);

    @GetMapping("/api/resumes/{resumeId}")
    ResumeResponse getResumeById(
            @PathVariable Long resumeId,
            @RequestHeader("X-User-Id") Long candidateId);
}
