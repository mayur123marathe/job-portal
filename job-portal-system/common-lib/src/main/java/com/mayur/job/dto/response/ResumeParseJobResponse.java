package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.ParseStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResumeParseJobResponse {

    private Long id;
    private Long candidateId;
    private Long resumeId;
    private String originalFileName;
    private String fileType;
    private ParseStatus status;
    /**
     * Only included when status = COMPLETED — the pre-filled
     * JSON structure shown in the builder preview before the
     * candidate confirms and saves it.
     */
    private String parsedData;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
