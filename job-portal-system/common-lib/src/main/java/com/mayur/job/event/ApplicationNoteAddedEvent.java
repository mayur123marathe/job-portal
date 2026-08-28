package com.mayur.job.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationNoteAddedEvent {
    private Long applicationId;
    private Long candidateId;
    private String candidateEmail;
    private String candidateName;
    private String jobTitle;
    private String companyName;
    private LocalDateTime addedAt;
}
