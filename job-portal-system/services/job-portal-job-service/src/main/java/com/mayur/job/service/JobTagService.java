package com.mayur.job.service;

import com.mayur.job.dto.response.JobTagResponse;
import com.mayur.job.dto.request.BulkJobTagRequest;
import com.mayur.job.dto.request.JobTagRequest;
import com.mayur.job.dto.response.BulkJobTagResponse;
import com.mayur.job.modal.JobTag;

import java.util.List;
import java.util.Set;

public interface JobTagService {

    JobTagResponse createTag(JobTagRequest req) throws Exception;

    BulkJobTagResponse createTagsBulk(BulkJobTagRequest req);

    List<JobTagResponse> getAllTags();

    List<JobTagResponse> searchTags(String keyword);

    JobTagResponse getTagById(Long id) throws Exception;

    JobTagResponse updateTag(Long id, JobTagRequest req)
            throws Exception;

    void deleteTag(Long id) throws Exception;

    /** Used internally to load tags by IDs for job creation. */
    Set<JobTag> getTagEntitiesByIds(Set<Long> ids) throws Exception;
}
