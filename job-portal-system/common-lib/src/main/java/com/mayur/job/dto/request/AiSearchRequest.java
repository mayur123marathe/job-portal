package com.mayur.job.dto.request;

import com.mayur.job.domain.JobType;
import com.mayur.job.domain.WorkMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request body for POST /api/jobs/search (AI semantic search).
 *
 * The {@code query} field accepts a natural-language description of
 * what the candidate is looking for — e.g.:
 *   "I'm a React developer with 3 years experience, looking for a remote
 *    startup role with a salary above 80k".
 *
 * Optional hard filters can be combined with the AI query to narrow results
 * before semantic ranking.
 */
@Data
public class AiSearchRequest {

    /** Natural-language description of the desired role. Required. */
    @NotBlank(message = "Search query must not be empty")
    private String query;

    /** Optional hard filters applied before AI ranking. */
    private JobType jobType;
    private WorkMode workMode;
    private String location;
}
