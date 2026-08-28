package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.ApplicationSource;
import com.mayur.job.domain.ApplicationStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Full application detail — used on the application detail page (employer view).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationResponse {

    private Long id;
    private UserResponse candidate;
    private Long employerId;

    private JobResponse job;
    private CompanyResponse company;

    private ApplicationStatus status;

    // Submission content
    private Long resumeId;
    private String coverLetter;

    // Candidate preferences
    private BigDecimal expectedSalary;
    private LocalDate availableFrom;

    // Tracking
    private Boolean isRead;
    private Boolean isStarred;

    // Related data (populated on demand)
    private List<ApplicationStatusHistoryResponse> statusHistory;
    private List<InterviewResponse> interviews;
    private List<ApplicationNoteResponse> notes;

    // Withdrawal
    private LocalDateTime withdrawnAt;
    private String withdrawnReason;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    // AI screening result — null until background scoring completes
    private ApplicationScreeningResponse screening;
}
