package com.mayur.job.service;

import com.mayur.job.dto.response.EducationResponse;
import com.mayur.job.dto.resume.request.AddEducationRequest;

import java.util.List;

public interface EducationService {

    EducationResponse addEducation(Long resumeId, Long candidateId, AddEducationRequest req)
            throws Exception;

    List<EducationResponse> getEducations(Long resumeId) throws Exception;

    EducationResponse updateEducation(Long educationId, Long resumeId, Long candidateId,
                                      AddEducationRequest req) throws Exception;

    void deleteEducation(Long educationId, Long resumeId, Long candidateId)
            throws Exception;
}
