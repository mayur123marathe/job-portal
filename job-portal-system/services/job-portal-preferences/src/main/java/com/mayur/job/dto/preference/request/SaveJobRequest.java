package com.mayur.job.dto.preference.request;

import lombok.Data;

@Data
public class SaveJobRequest {

    private Long jobId;

    /** Denormalized from job — passed by the client to avoid a Feign call. */
    private Long companyId;

    /** Optional personal note the candidate can attach. */
    private String notes;
}
