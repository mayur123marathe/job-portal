package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.InterviewStatus;
import com.mayur.job.domain.InterviewType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InterviewResponse {

    private Long id;
    private Long applicationId;
    private Long candidateId;
    private Long jobId;
    private Long companyId;

    private InterviewType interviewType;
    private InterviewStatus status;
    private Integer roundNumber;

    private LocalDateTime scheduledAt;
    private Integer durationMinutes;
    private String location;
    private String meetingLink;

    private List<Long> interviewerIds;
    private String candidateInstructions;

    // Post-interview (visible after COMPLETED)
    private String feedback;
    private Integer rating;
    private String recommendation;

    private String cancellationReason;
    private LocalDateTime cancelledAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
