package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.SubscriptionPlan;
import com.mayur.job.domain.SubscriptionStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanySubscriptionResponse {

    private Long id;
    private Long companyId;

    private SubscriptionPlan plan;
    private SubscriptionStatus status;

    // Billing period
    private LocalDate startDate;
    private LocalDate endDate;

    // Snapshotted limits
    private Integer maxJobPostings;
    private Integer maxFeaturedJobs;
    private Integer maxResumeViews;
    private Integer jobPostingDurationDays;

    // Usage counters
    private Integer jobPostingsUsed;
    private Integer featuredJobsUsed;
    private Integer resumeViewsUsed;

    // Renewal & cancellation
    private Boolean autoRenew;
    private String cancellationReason;
    private LocalDateTime cancelledAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
