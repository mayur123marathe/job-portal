package com.mayur.job.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BulkJobSkillFailure {

    /** 0-based position in the original request list. */
    private int index;

    /** Skill name from the request — helps the caller identify which item failed. */
    private String name;

    /** Reason for failure. */
    private String error;
}
