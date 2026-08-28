package com.mayur.job.service;

import com.mayur.job.dto.response.SavedJobResponse;
import com.mayur.job.dto.preference.request.SaveJobRequest;

import java.util.List;

public interface SavedJobService {

    SavedJobResponse saveJob(Long candidateId, SaveJobRequest req) throws Exception;

    void unsaveJob(Long candidateId, Long savedJobId) throws Exception;

    List<SavedJobResponse> getMySavedJobs(Long candidateId);

    boolean isSaved(Long candidateId, Long jobId);
}
