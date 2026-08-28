package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationNoteResponse {

    private Long id;
    private Long addedByUserId;
    private String content;
    private LocalDateTime createdAt;
}
