package com.mayur.job.service;

import com.mayur.job.dto.response.JobResponse;
import com.mayur.job.dto.response.JobSummaryResponse;
import com.mayur.job.dto.request.AiSearchRequest;
import com.mayur.job.dto.request.BulkJobRequest;
import com.mayur.job.dto.request.JobRequest;
import com.mayur.job.dto.request.JobSearchRequest;
import com.mayur.job.dto.response.BulkJobResponse;
import com.mayur.job.modal.Job;

import java.util.List;

public interface JobService {

    JobResponse createJob(Long employerId, JobRequest req)
            throws Exception;
    BulkJobResponse createJobsBulk(Long employerId, BulkJobRequest req);

    JobResponse getJobById(Long id) throws Exception;

    JobResponse getJobSummaryById(Long id) throws Exception;

    List<JobResponse> getJobs(JobSearchRequest req);

    List<JobResponse> aiSearch(AiSearchRequest req);

    List<JobResponse> getJobsByCompany(Long companyId);

    List<JobResponse> getJobsByEmployer(Long employerId);

    List<JobResponse> getJobsByCategory(Long categoryId);

    JobResponse updateJob(Long jobId, Long employerId, JobRequest req)
            throws Exception;

    JobResponse publishJob(Long jobId, Long employerId)
            throws Exception;

    JobResponse closeJob(Long jobId, Long employerId)
            throws Exception;

    void deleteJob(Long jobId, Long employerId)
            throws Exception;

    void incrementViewCount(Long jobId) throws Exception;

    void incrementApplicationCount(Long jobId) throws Exception;

    List<JobResponse> getAllJobsAdmin();

    Job getJobEntityById(Long id) throws Exception;
}
