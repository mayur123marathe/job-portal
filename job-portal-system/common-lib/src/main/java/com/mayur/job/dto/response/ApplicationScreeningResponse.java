package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.AiShortlistStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * AI screening result attached to an application response.
 * Populated once the background scoring job completes.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationScreeningResponse {

    private Long id;
    private Integer overallScore;
    private Integer skillsMatchScore;
    private Integer experienceMatchScore;
    private Integer educationMatchScore;
    private AiShortlistStatus shortlistStatus;

    private String summary;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> strengths;
    private List<String> concerns;

    /** True if the job was edited after scoring — score may be outdated. */
    private Boolean isStale;

    private LocalDateTime screenedAt;

    /** Prompt/model version used — helps compare scores across versions. */
    private String screeningVersion;
}
