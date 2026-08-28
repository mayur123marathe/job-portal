package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.AiShortlistStatus;
import com.mayur.job.domain.ApplicationSource;
import com.mayur.job.domain.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Lightweight application card — used in application list views.
 * Employer sees: candidate + job + status + applied date.
 * Candidate sees: job + company + status + applied date.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationSummaryResponse {

    private Long id;
    private Long candidateId;
    private Long jobId;
    private Long companyId;

    private ApplicationStatus status;
    private ApplicationSource source;

    private Boolean isRead;
    private Boolean isStarred;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    // AI screening summary — available once background scoring completes
    private Integer aiScore;
    private AiShortlistStatus aiShortlistStatus;
}
