package com.mayur.job.dto.application.request;

import com.mayur.job.domain.InterviewStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateInterviewRequest {

    private InterviewStatus status;

    @Future(message = "Rescheduled time must be in the future")
    private LocalDateTime scheduledAt;

    private Integer durationMinutes;
    private String location;
    private String meetingLink;
    private List<Long> interviewerIds;
    private String candidateInstructions;
    private String cancellationReason;

    // Post-interview feedback fields
    private String feedback;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    /** e.g. "Strong Hire", "Hire", "No Hire", "Strong No Hire". */
    private String recommendation;
}
