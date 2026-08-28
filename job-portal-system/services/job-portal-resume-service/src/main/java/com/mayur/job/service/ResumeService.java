package com.mayur.job.service;

import com.mayur.job.dto.resume.request.CreateResumeRequest;
import com.mayur.job.dto.resume.request.UpdatePersonalInfoRequest;
import com.mayur.job.dto.resume.request.UpdateResumeRequest;
import com.mayur.job.dto.resume.response.ResumeResponse;
import com.mayur.job.modal.Resume;

import java.util.List;

public interface ResumeService {

    ResumeResponse createResume(Long candidateId, CreateResumeRequest req);

    ResumeResponse getResumeById(Long resumeId, Long candidateId) throws Exception;

    List<ResumeResponse> getMyResumes(Long candidateId);

    ResumeResponse updatePersonalInfo(
            Long resumeId, Long candidateId,
            UpdatePersonalInfoRequest req)
            throws Exception;

    ResumeResponse updateSummary(Long resumeId, Long candidateId,
                                 String summary)
            throws Exception;

    ResumeResponse updateResume(Long resumeId, Long candidateId, UpdateResumeRequest req)
            throws Exception;

    ResumeResponse setDefaultResume(Long resumeId, Long candidateId) throws Exception;

    void deleteResume(Long resumeId, Long candidateId) throws Exception;

    Resume getResumeEntity(Long resumeId) throws Exception;
}
