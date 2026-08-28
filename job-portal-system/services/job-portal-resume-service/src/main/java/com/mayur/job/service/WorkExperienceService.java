package com.mayur.job.service;

import com.mayur.job.dto.response.WorkExperienceResponse;

import com.mayur.job.dto.resume.request.AddWorkExperienceRequest;

import java.util.List;

public interface WorkExperienceService {

    WorkExperienceResponse addWorkExperience(Long resumeId,
                                             Long candidateId,
                                             AddWorkExperienceRequest req)
            throws Exception;

    List<WorkExperienceResponse> getWorkExperiences(Long resumeId) throws Exception;

    WorkExperienceResponse updateWorkExperience(
            Long experienceId, Long resumeId, Long candidateId,
            AddWorkExperienceRequest req) throws Exception;

    void deleteWorkExperience(Long experienceId, Long resumeId,
                              Long candidateId)
            throws Exception;
}
