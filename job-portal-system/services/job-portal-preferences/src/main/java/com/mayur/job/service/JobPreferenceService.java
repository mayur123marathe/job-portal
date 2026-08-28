package com.mayur.job.service;

import com.mayur.job.dto.response.JobPreferenceResponse;
import com.mayur.job.dto.preference.request.UpdateJobPreferenceRequest;

public interface JobPreferenceService {

    JobPreferenceResponse getOrCreatePreference(Long candidateId);

    JobPreferenceResponse updatePreference(Long candidateId, UpdateJobPreferenceRequest req);
}
