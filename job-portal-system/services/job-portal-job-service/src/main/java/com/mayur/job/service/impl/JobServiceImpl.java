package com.mayur.job.service.impl;

import com.mayur.job.client.CompanyClient;
import com.mayur.job.domain.JobStatus;
import com.mayur.job.dto.request.AiSearchRequest;
import com.mayur.job.dto.request.BulkJobRequest;
import com.mayur.job.dto.response.CompanyResponse;
import com.mayur.job.dto.response.JobResponse;
import com.mayur.job.dto.response.JobSummaryResponse;
import com.mayur.job.dto.request.JobRequest;
import com.mayur.job.dto.request.JobSearchRequest;
import com.mayur.job.dto.response.BulkJobFailure;
import com.mayur.job.dto.response.BulkJobResponse;
import com.mayur.job.modal.Job;
import com.mayur.job.modal.JobCategory;
import com.mayur.job.modal.JobSkill;
import com.mayur.job.modal.JobTag;
import com.mayur.job.modal.embeddable.JobLocation;
import com.mayur.job.modal.embeddable.SalaryRange;
import com.mayur.job.mapper.JobMapper;
import com.mayur.job.repository.JobRepository;
import com.mayur.job.repository.JobSpecification;
import com.mayur.job.service.JobCategoryService;
import com.mayur.job.service.JobService;
import com.mayur.job.service.JobSkillService;
import com.mayur.job.service.JobTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final JobCategoryService categoryService;
    private final JobSkillService skillService;
    private final JobTagService tagService;
    private final CompanyClient companyClient;

    // ── Create ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobResponse createJob(Long employerId, JobRequest req)
            throws Exception {
        CompanyResponse company = companyClient.getMyCompany(employerId);
        Long companyId = company.getId();

        JobCategory category = categoryService
                .getCategoryEntityById(req.getCategoryId());

        Set<JobSkill> skills = req.getSkillIds() != null
                ? skillService.getSkillEntitiesByIds(req.getSkillIds())
                : Collections.emptySet();

        Set<JobTag> tags = req.getTagIds() != null
                ? tagService.getTagEntitiesByIds(req.getTagIds())
                : Collections.emptySet();

        Job job = Job.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .requirements(req.getRequirements())
                .responsibilities(req.getResponsibilities())
                .benefits(req.getBenefits())
                .companyId(companyId)
                .employerId(employerId)
                .category(category)
                .skills(skills)
                .tags(tags)
                .location(buildLocation(req))
                .salaryRange(buildSalaryRange(req))
                .jobType(req.getJobType())
                .workMode(req.getWorkMode())
                .experienceLevel(req.getExperienceLevel())
                .openings(req.getOpenings() != null ? req.getOpenings() : 1)
                .applicationDeadline(req.getApplicationDeadline())
                .expiresAt(req.getExpiresAt())
                .build();



        return convertToResponse(jobRepository.save(job));
    }

    @Override
    public BulkJobResponse createJobsBulk(Long employerId, BulkJobRequest req) {
        List<JobResponse>   succeeded = new ArrayList<>();
        List<BulkJobFailure> failed   = new ArrayList<>();

        List<JobRequest> jobs = req.getJobs();
        for (int i = 0; i < jobs.size(); i++) {
            JobRequest jobReq = jobs.get(i);
            try {
                succeeded.add(createJob(employerId, jobReq));
            } catch (Exception e) {
                failed.add(BulkJobFailure.builder()
                        .index(i)
                        .title(jobReq.getTitle())
                        .error(e.getMessage())
                        .build());
            }
        }

        return BulkJobResponse.builder()
                .totalRequested(jobs.size())
                .totalSucceeded(succeeded.size())
                .totalFailed(failed.size())
                .succeeded(succeeded)
                .failed(failed)
                .build();
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) throws Exception {
        return convertToResponse(getJobEntityById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobSummaryById(Long id) throws Exception {
        return JobMapper.toSummaryResponse(getJobEntityById(id));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "jobs")
    public List<JobResponse> getJobs(JobSearchRequest req) {
        List<Job> jobs=jobRepository.findAll(JobSpecification.build(req));

        return jobs.stream().map(
                job->{

                    return convertToResponse(job);
                }
        ).collect(Collectors.toList());
    }

    @Override
    public List<JobResponse> aiSearch(AiSearchRequest req) {
        // TODO: implement semantic search using vector embeddings
        // Steps when ready:
        //   1. Call an embedding model to convert req.getQuery() into a vector
        //   2. Run similarity search against stored job embeddings (pgvector / Pinecone / etc.)
        //   3. Apply req.getJobType() / workMode / location as post-filters
        //   4. Return ranked JobResponse list
        throw new UnsupportedOperationException("AI search is not yet implemented");
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyIdAndActiveTrue(companyId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByEmployer(Long employerId) {
        return jobRepository.findByEmployerId(employerId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getJobsByCategory(Long categoryId) {
        return jobRepository.findByCategory_Id(categoryId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobsAdmin() {
        return jobRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobResponse updateJob(Long jobId, Long employerId, JobRequest req)
            throws Exception {
        Job job = getJobEntityById(jobId);
        assertEmployer(job, employerId);

        JobCategory category = categoryService.getCategoryEntityById(req.getCategoryId());
        Set<JobSkill> skills = req.getSkillIds() != null
                ? skillService.getSkillEntitiesByIds(req.getSkillIds())
                : Collections.emptySet();
        Set<JobTag> tags = req.getTagIds() != null
                ? tagService.getTagEntitiesByIds(req.getTagIds())
                : Collections.emptySet();

        job.setTitle(req.getTitle());
        job.setDescription(req.getDescription());
        job.setRequirements(req.getRequirements());
        job.setResponsibilities(req.getResponsibilities());
        job.setBenefits(req.getBenefits());
        job.setCategory(category);
        job.setSkills(skills);
        job.setTags(tags);
        job.setLocation(buildLocation(req));
        job.setSalaryRange(buildSalaryRange(req));
        job.setJobType(req.getJobType());
        job.setWorkMode(req.getWorkMode());
        job.setExperienceLevel(req.getExperienceLevel());
        job.setOpenings(req.getOpenings() != null ? req.getOpenings() : job.getOpenings());
        job.setApplicationDeadline(req.getApplicationDeadline());
        job.setExpiresAt(req.getExpiresAt());

        return convertToResponse(jobRepository.save(job));
    }

    // ── Status transitions ────────────────────────────────────────────────────

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobResponse publishJob(Long jobId, Long employerId)
            throws Exception {
        Job job = getJobEntityById(jobId);
        assertEmployer(job, employerId);
        if (job.getStatus() == JobStatus.CLOSED || job.getStatus() == JobStatus.EXPIRED) {
            throw new Exception("Cannot publish a job with status: " + job.getStatus());
        }
        job.setStatus(JobStatus.OPEN);
        job.setPublishedAt(LocalDateTime.now());
        job.setActive(true);
        return convertToResponse(jobRepository.save(job));
    }

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public JobResponse closeJob(Long jobId, Long employerId)
            throws Exception {
        Job job = getJobEntityById(jobId);
        assertEmployer(job, employerId);
        job.setStatus(JobStatus.CLOSED);
        job.setClosedAt(LocalDateTime.now());
        job.setActive(false);
        return convertToResponse(jobRepository.save(job));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    @CacheEvict(value = "jobs", allEntries = true)
    public void deleteJob(Long jobId, Long employerId)
            throws Exception {
        Job job = getJobEntityById(jobId);
        assertEmployer(job, employerId);
        jobRepository.delete(job);
    }

    // ── Analytics ─────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void incrementViewCount(Long jobId) throws Exception {
        Job job = getJobEntityById(jobId);
        job.setViewCount(job.getViewCount() + 1);
        jobRepository.save(job);
    }

    @Override
    @Transactional
    public void incrementApplicationCount(Long jobId) throws Exception {
        Job job = getJobEntityById(jobId);
        job.setApplicationCount(job.getApplicationCount() + 1);
        jobRepository.save(job);
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Job getJobEntityById(Long id) throws Exception {
        return jobRepository.findById(id)
                .orElseThrow(() -> new Exception("Job not found with id: " + id));
    }

    // ── Private utilities ─────────────────────────────────────────────────────

    private void assertEmployer(Job job, Long employerId) throws Exception {
        if (!job.getEmployerId().equals(employerId)) {
            throw new Exception("You are not the employer who posted this job");
        }
    }

    private JobLocation buildLocation(JobRequest req) {
        return JobLocation.builder()
                .address(req.getAddress())
                .city(req.getCity())
                .state(req.getState())
                .country(req.getCountry())
                .zipCode(req.getZipCode())
                .build();
    }

    private SalaryRange buildSalaryRange(JobRequest req) {
        return SalaryRange.builder()
                .minSalary(req.getMinSalary())
                .maxSalary(req.getMaxSalary())
                .currency(req.getCurrency())
                .period(req.getSalaryPeriod())
                .negotiable(req.getSalaryNegotiable())
                .disclosed(req.getSalaryDisclosed())
                .build();
    }

    private JobResponse convertToResponse(Job job) {
        CompanyResponse companySummaryResponse = companyClient
                .getCompanySummaryById(job.getCompanyId());

        return JobMapper.toResponse(job, companySummaryResponse);


    }
}
