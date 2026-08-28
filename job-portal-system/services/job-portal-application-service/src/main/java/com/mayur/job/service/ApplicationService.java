package com.mayur.job.service;

import com.mayur.job.dto.response.ApplicationResponse;
import com.mayur.job.dto.application.request.CompanyApplicationFilterRequest;
import com.mayur.job.dto.application.request.CreateApplicationRequest;
import com.mayur.job.dto.application.request.UpdateApplicationStatusRequest;
import com.mayur.job.dto.application.request.WithdrawApplicationRequest;
import com.mayur.job.entity.Application;

import java.util.List;

public interface ApplicationService {

    ApplicationResponse createApplication(Long candidateId,
                                          CreateApplicationRequest req)
            throws Exception;

    ApplicationResponse getApplicationById(Long id) throws Exception;

    List<ApplicationResponse> getMyApplications(Long candidateId);

    List<ApplicationResponse> getApplicationsForJob(Long jobId);

    List<ApplicationResponse> getApplicationsForCompany(Long companyId,
                                                        CompanyApplicationFilterRequest filter) throws Exception;

    ApplicationResponse updateStatus(Long applicationId,
                                     Long employerId,
                                     UpdateApplicationStatusRequest req)
            throws Exception;

    ApplicationResponse withdraw(Long applicationId, Long candidateId,
                                 WithdrawApplicationRequest req)
            throws Exception;

    ApplicationResponse markAsRead(Long applicationId, Long employerId)
            throws Exception;

    ApplicationResponse toggleStar(Long applicationId, Long employerId)
            throws Exception;

    void deleteApplication(Long applicationId, Long candidateId)
            throws Exception;

    /** Used internally by interview/note services. */
    Application getApplicationEntity(Long id) throws Exception;

    /** Called by job-service after a job's requirements are edited — marks all existing scores as stale. */
    void markScreeningsStaleForJob(Long jobId);
}
