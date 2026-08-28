package com.mayur.job.service;

import com.mayur.job.dto.response.ResumeParseJobResponse;
import com.mayur.job.dto.resume.request.ParseResumeRequest;

import java.util.List;

public interface ResumeParseJobService {

    ResumeParseJobResponse submitParseJob(Long candidateId, ParseResumeRequest req);

    ResumeParseJobResponse getParseJob(Long jobId, Long candidateId) throws Exception;

    List<ResumeParseJobResponse> getMyParseJobs(Long candidateId);
}
