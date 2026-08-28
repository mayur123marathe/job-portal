package com.mayur.job.dto.application.request;

import com.mayur.job.domain.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateApplicationStatusRequest {

    @NotNull(message = "New status is required")
    private ApplicationStatus status;

    /**
     * Optional note explaining the decision.
     * Stored in ApplicationStatusHistory for audit trail.
     * e.g. "Strong technical background, moving to next round."
     */
    private String note;
}
