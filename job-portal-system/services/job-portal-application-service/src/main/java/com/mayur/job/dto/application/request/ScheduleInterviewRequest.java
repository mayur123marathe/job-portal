package com.mayur.job.dto.application.request;

import com.mayur.job.domain.InterviewType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleInterviewRequest {

    @NotNull(message = "Interview type is required")
    private InterviewType interviewType;

    @NotNull(message = "Scheduled date and time is required")
    @Future(message = "Interview must be scheduled in the future")
    private LocalDateTime scheduledAt;

    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 480, message = "Duration must not exceed 8 hours")
    @Builder.Default
    private Integer durationMinutes = 60;

    /** Physical address for IN_PERSON; platform name for VIDEO_CALL (e.g. "Google Meet"). */
    private String location;

    /** Meeting URL — required for VIDEO_CALL type. */
    private String meetingLink;

    @NotEmpty(message = "At least one interviewer is required")
    private List<Long> interviewerIds;

    /** Round number in the pipeline (1 = first round, 2 = second, etc.). */
    @Min(value = 1, message = "Round number must be at least 1")
    @Builder.Default
    private Integer roundNumber = 1;

    /** Instructions sent to the candidate (agenda, what to prepare, dress code, etc.). */
    private String candidateInstructions;
}
