package com.mayur.job.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BulkJobFailure {

    /** 0-based position in the original request list. */
    private int index;

    /** Job title from the request — helps the caller identify which item failed. */
    private String title;

    /** Reason for failure. */
    private String error;
}
