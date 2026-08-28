package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SavedJobResponse {

    private Long id;
    private Long candidateId;
    private Long jobId;
    private Long companyId;
    private String notes;
    private LocalDateTime savedAt;
}
