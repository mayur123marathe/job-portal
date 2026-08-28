package com.mayur.job.dto.response;


import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BulkJobTagResponse {

    private int totalRequested;
    private int totalSucceeded;
    private int totalFailed;

    /** Successfully created tags. */
    private List<JobTagResponse> succeeded;

    /** Tags that failed, with their index and reason. */
    private List<BulkJobTagFailure> failed;
}
