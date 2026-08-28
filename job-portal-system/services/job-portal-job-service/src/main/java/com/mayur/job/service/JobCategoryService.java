package com.mayur.job.service;

import com.mayur.job.dto.response.JobCategoryResponse;
import com.mayur.job.dto.request.BulkJobCategoryRequest;
import com.mayur.job.dto.request.JobCategoryRequest;
import com.mayur.job.dto.response.BulkJobCategoryResponse;
import com.mayur.job.modal.JobCategory;

import java.util.List;

public interface JobCategoryService {

    JobCategoryResponse createCategory(JobCategoryRequest req)
            throws Exception;

    BulkJobCategoryResponse createCategoriesBulk(BulkJobCategoryRequest req);

    List<JobCategoryResponse> getAllCategories();

    List<JobCategoryResponse> getRootCategories();

    JobCategoryResponse getCategoryById(Long id) throws Exception;

    JobCategoryResponse getCategoryBySlug(String slug) throws Exception;

    JobCategoryResponse updateCategory(Long id, JobCategoryRequest req)
            throws Exception;

    void deleteCategory(Long id) throws Exception;

    /** Used internally. */
    JobCategory getCategoryEntityById(Long id) throws Exception;
}
