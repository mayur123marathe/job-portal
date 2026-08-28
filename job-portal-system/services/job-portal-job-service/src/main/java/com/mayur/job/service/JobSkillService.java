package com.mayur.job.service;

import com.mayur.job.domain.SkillCategory;
import com.mayur.job.dto.response.JobSkillResponse;
import com.mayur.job.dto.request.BulkJobSkillRequest;
import com.mayur.job.dto.request.JobSkillRequest;
import com.mayur.job.dto.response.BulkJobSkillResponse;
import com.mayur.job.modal.JobSkill;

import java.util.List;
import java.util.Set;

public interface JobSkillService {

    JobSkillResponse createSkill(JobSkillRequest req) throws Exception;

    BulkJobSkillResponse createSkillsBulk(BulkJobSkillRequest req);

    List<JobSkillResponse> getAllSkills();

    List<JobSkillResponse> getSkillsByCategory(SkillCategory category);

    List<JobSkillResponse> searchSkills(String keyword);

    JobSkillResponse getSkillById(Long id) throws Exception;

    JobSkillResponse updateSkill(Long id, JobSkillRequest req)
            throws Exception;

    void deleteSkill(Long id) throws Exception;

    /** Used internally to load skills by IDs for job creation. */
    Set<JobSkill> getSkillEntitiesByIds(Set<Long> ids) throws Exception;
}
