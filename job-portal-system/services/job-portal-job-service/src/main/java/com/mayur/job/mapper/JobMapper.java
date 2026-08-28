package com.mayur.job.mapper;

import com.mayur.job.dto.response.*;
import com.mayur.job.modal.Job;
import com.mayur.job.modal.JobCategory;
import com.mayur.job.modal.JobSkill;
import com.mayur.job.modal.JobTag;
import com.mayur.job.modal.embeddable.JobLocation;
import com.mayur.job.modal.embeddable.SalaryRange;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class JobMapper {

    private JobMapper() {}

    // ── Skill ─────────────────────────────────────────────────────────────────

    public static JobSkillResponse toSkillResponse(JobSkill skill) {
        return JobSkillResponse.builder()
                .id(skill.getId())
                .name(skill.getName())
                .slug(skill.getSlug())
                .category(skill.getCategory())
                .active(skill.getActive())
                .build();
    }

    // ── Tag ───────────────────────────────────────────────────────────────────

    public static JobTagResponse toTagResponse(JobTag tag) {
        return JobTagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .slug(tag.getSlug())
                .build();
    }

    // ── Category ──────────────────────────────────────────────────────────────

    public static JobCategoryResponse toCategoryResponse(JobCategory category) {
        return toCategoryResponse(category, false);
    }

    public static JobCategoryResponse toCategoryResponse(
            JobCategory category,
            boolean includeSubCategories) {
        List<JobCategoryResponse> subCategories = null;
        if (includeSubCategories && category.getSubCategories() != null) {
            subCategories = category.getSubCategories().stream()
                    .filter(sub -> Boolean.TRUE.equals(sub.getActive()))
                    .map(sub -> toCategoryResponse(sub, false))
                    .collect(Collectors.toList());
        }

        return JobCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .iconUrl(category.getIconUrl())
                .active(category.getActive())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .parentName(category.getParent() != null ? category.getParent().getName() : null)
                .subCategories(subCategories)
                .createdAt(category.getCreatedAt())
                .build();
    }



    // ── Job ───────────────────────────────────────────────────────────────────

    public static JobResponse toSummaryResponse(Job job) {
        JobLocation loc = job.getLocation();
        SalaryRange sal = job.getSalaryRange();

        Set<String> skillNames = job.getSkills() == null ? Collections.emptySet()
                : job.getSkills().stream().map(JobSkill::getName).collect(Collectors.toSet());

        Set<String> tagNames = job.getTags() == null ? Collections.emptySet()
                : job.getTags().stream().map(JobTag::getName).collect(Collectors.toSet());

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyId(job.getCompanyId())
                .city(loc != null ? loc.getCity() : null)
                .country(loc != null ? loc.getCountry() : null)
                .minSalary(sal != null ? sal.getMinSalary() : null)
                .maxSalary(sal != null ? sal.getMaxSalary() : null)
                .currency(sal != null ? sal.getCurrency() : null)
                .salaryDisclosed(sal != null ? sal.getDisclosed() : null)
                .jobType(job.getJobType())
                .workMode(job.getWorkMode())
                .experienceLevel(job.getExperienceLevel())
                .status(job.getStatus())
                .categoryName(job.getCategory() != null ? job.getCategory().getName() : null)
                .skillNames(skillNames)
                .tagNames(tagNames)
                .openings(job.getOpenings())
                .applicationCount(job.getApplicationCount())
                .applicationDeadline(job.getApplicationDeadline())
                .createdAt(job.getCreatedAt())
                .build();
    }

    public static JobResponse toResponse(
            Job job,
            CompanyResponse company
    ) {
        Set<JobSkillResponse> skills = job.getSkills() == null
                ? Collections.emptySet()
                : job.getSkills().stream().map(JobMapper::toSkillResponse).collect(Collectors.toSet());

        Set<JobTagResponse> tags = job.getTags() == null ? Collections.emptySet()
                : job.getTags().stream().map(JobMapper::toTagResponse).collect(Collectors.toSet());

        JobLocation loc = job.getLocation();
        SalaryRange sal = job.getSalaryRange();

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .responsibilities(job.getResponsibilities())
                .benefits(job.getBenefits())
                .company(company)
                .employerId(job.getEmployerId())
                .category(toCategoryResponse(job.getCategory()))
                .skills(skills)
                .tags(tags)
                // location
                .address(loc != null ? loc.getAddress() : null)
                .city(loc != null ? loc.getCity() : null)
                .state(loc != null ? loc.getState() : null)
                .country(loc != null ? loc.getCountry() : null)
                .zipCode(loc != null ? loc.getZipCode() : null)
                // salary
                .minSalary(sal != null ? sal.getMinSalary() : null)
                .maxSalary(sal != null ? sal.getMaxSalary() : null)
                .currency(sal != null ? sal.getCurrency() : null)
                .salaryPeriod(sal != null ? sal.getPeriod() : null)
                .salaryNegotiable(sal != null ? sal.getNegotiable() : null)
                .salaryDisclosed(sal != null ? sal.getDisclosed() : null)
                // classification
                .jobType(job.getJobType())
                .workMode(job.getWorkMode())
                .experienceLevel(job.getExperienceLevel())
                .status(job.getStatus())
                // posting
                .openings(job.getOpenings())
                .applicationDeadline(job.getApplicationDeadline())
                .expiresAt(job.getExpiresAt())
                .active(job.getActive())
                // analytics
                .viewCount(job.getViewCount())
                .applicationCount(job.getApplicationCount())
                // timestamps
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .publishedAt(job.getPublishedAt())
                .closedAt(job.getClosedAt())
                .build();
    }



}
