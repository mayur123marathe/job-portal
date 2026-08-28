package com.mayur.job.client;

import com.mayur.job.dto.response.JobResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "job-portal-job-service")
public interface JobClient {

    @GetMapping("/api/jobs/{id}")
    JobResponse getJobById(@PathVariable("id") Long id);

    @GetMapping("/api/jobs/{id}/summary")
    JobResponse getJobSummaryById(@PathVariable("id") Long id);
}
