package com.mayur.job.dto.response;

import com.mayur.job.dto.response.JobCategoryResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BulkJobCategoryResponse {

    private int totalRequested;
    private int totalSucceeded;
    private int totalFailed;

    /** Successfully created categories. */
    private List<JobCategoryResponse> succeeded;

    /** Categories that failed, with their index and reason. */
    private List<BulkJobCategoryFailure> failed;
}
