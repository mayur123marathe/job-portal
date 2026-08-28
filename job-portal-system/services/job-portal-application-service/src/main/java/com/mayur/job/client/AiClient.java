package com.mayur.job.client;

import com.mayur.job.dto.response.ApiResponse;
import com.mayur.job.dto.application.request.ScreeningScoreRequest;
import com.mayur.job.dto.application.response.ScreeningScoreResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "job-portal-ai-service")
public interface AiClient {

    @PostMapping("/api/ai/application/screening-score")
    ApiResponse<ScreeningScoreResponse> scoreCandidate(@RequestBody ScreeningScoreRequest request);
}
