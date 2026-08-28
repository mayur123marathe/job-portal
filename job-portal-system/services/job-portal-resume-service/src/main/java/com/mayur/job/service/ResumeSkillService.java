package com.mayur.job.service;

import com.mayur.job.dto.response.ResumeSkillResponse;
import com.mayur.job.dto.resume.request.AddResumeSkillRequest;

import java.util.List;

public interface ResumeSkillService {

    ResumeSkillResponse addSkill(Long resumeId, Long candidateId, AddResumeSkillRequest req)
            throws Exception;

    List<ResumeSkillResponse> getSkills(Long resumeId) throws Exception;

    ResumeSkillResponse updateSkill(Long skillId, Long resumeId, Long candidateId,
                                    AddResumeSkillRequest req) throws Exception;

    void deleteSkill(Long skillId, Long resumeId, Long candidateId) throws Exception;
}
