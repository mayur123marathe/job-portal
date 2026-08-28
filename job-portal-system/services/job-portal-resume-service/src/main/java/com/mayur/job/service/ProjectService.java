package com.mayur.job.service;

import com.mayur.job.dto.response.ProjectResponse;
import com.mayur.job.dto.resume.request.AddProjectRequest;

import java.util.List;

public interface ProjectService {

    ProjectResponse addProject(Long resumeId, Long candidateId, AddProjectRequest req)
            throws Exception;

    List<ProjectResponse> getProjects(Long resumeId) throws Exception;

    ProjectResponse updateProject(Long projectId, Long resumeId, Long candidateId,
                                  AddProjectRequest req) throws Exception;

    void deleteProject(Long projectId, Long resumeId, Long candidateId)
            throws Exception;
}
