package com.mayur.job.dto.response;

import com.mayur.job.dto.response.JobResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BulkJobResponse {

    private int totalRequested;
    private int totalSucceeded;
    private int totalFailed;

    /** Successfully created jobs. */
    private List<JobResponse> succeeded;

    /** Jobs that failed, with their index and reason. */
    private List<BulkJobFailure> failed;
}
