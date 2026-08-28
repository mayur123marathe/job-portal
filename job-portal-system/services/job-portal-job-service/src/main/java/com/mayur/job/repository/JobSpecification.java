package com.mayur.job.repository;

import com.mayur.job.domain.JobStatus;
import com.mayur.job.dto.request.JobSearchRequest;
import com.mayur.job.modal.Job;
import com.mayur.job.modal.JobSkill;
import com.mayur.job.modal.JobTag;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class JobSpecification {

    private JobSpecification() {}

    /**
     * Builds a combined Specification from a {@link JobSearchRequest}.
     * All filters are optional — only non-null params generate predicates.
     * When status is null, defaults to OPEN so public search shows only live jobs.
     */
    public static Specification<Job> build(JobSearchRequest req) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // ── Always: only active jobs ──────────────────────────────────────
            predicates.add(cb.isTrue(root.get("active")));

            // ── Status (default: OPEN) ────────────────────────────────────────
            JobStatus status = req.getStatus() != null
                    ? req.getStatus() : JobStatus.OPEN;
            predicates.add(cb.equal(root.get("status"), status));

            // ── Simple enum / scalar filters ──────────────────────────────────
            if (req.getJobType() != null) {
                predicates.add(cb.equal(root.get("jobType"), req.getJobType()));
            }
            if (req.getWorkMode() != null) {
                predicates.add(cb.equal(root.get("workMode"), req.getWorkMode()));
            }
            if (req.getExperienceLevel() != null) {
                predicates.add(cb.equal(root.get("experienceLevel"), req.getExperienceLevel()));
            }
            if (req.getCompanyId() != null) {
                predicates.add(cb.equal(root.get("companyId"), req.getCompanyId()));
            }
            if (req.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), req.getCategoryId()));
            }

            // ── Location (city OR state OR country LIKE) ──────────────────────
            if (req.getLocation() != null && !req.getLocation().isBlank()) {
                String pattern = "%" + req.getLocation().toLowerCase() + "%";
                Path<String> city    = root.get("location").get("city");
                Path<String> state   = root.get("location").get("state");
                Path<String> country = root.get("location").get("country");
                predicates.add(cb.or(
                        cb.like(cb.lower(city),    pattern),
                        cb.like(cb.lower(state),   pattern),
                        cb.like(cb.lower(country),  pattern)
                ));
            }

            // ── Salary range overlap ──────────────────────────────────────────
            // Overlap condition: job.minSalary <= req.maxSalary
            //                AND job.maxSalary >= req.minSalary
            if (req.getMinSalary() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.get("salaryRange").get("maxSalary"), req.getMinSalary()));
            }
            if (req.getMaxSalary() != null) {
                predicates.add(cb.lessThanOrEqualTo(
                        root.get("salaryRange").get("minSalary"), req.getMaxSalary()));
            }

            // ── Openings range ────────────────────────────────────────────────
            if (req.getMinOpenings() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("openings"), req.getMinOpenings()));
            }
            if (req.getMaxOpenings() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("openings"), req.getMaxOpenings()));
            }

            // ── Skills filter (jobs that have ANY of the given skill IDs) ─────
            if (req.getSkillIds() != null && !req.getSkillIds().isEmpty()) {
                Join<Job, JobSkill> skillJoin = root.join("skills", JoinType.INNER);
                predicates.add(skillJoin.get("id").in(req.getSkillIds()));
                query.distinct(true);
            }

            // ── Tags filter (jobs that have ANY of the given tag IDs) ─────────
            if (req.getTagIds() != null && !req.getTagIds().isEmpty()) {
                Join<Job, JobTag> tagJoin = root.join("tags", JoinType.INNER);
                predicates.add(tagJoin.get("id").in(req.getTagIds()));
                query.distinct(true);
            }

            // ── Keyword search ────────────────────────────────────────────────
            // Searches: title, description (direct), skill names, tag names (subquery).
            // Correlated subqueries avoid join multiplication with the filters above.
            if (req.getKeyword() != null && !req.getKeyword().isBlank()) {
                String pattern = "%" + req.getKeyword().toLowerCase() + "%";

                // Correlated subquery: jobs where any skill name matches
                Subquery<Long> skillSub = query.subquery(Long.class);
                Root<Job> skillJobRoot = skillSub.from(Job.class);
                Join<Job, JobSkill> skillSubJoin = skillJobRoot.join("skills", JoinType.INNER);
                skillSub.select(skillJobRoot.get("id"))
                        .where(cb.and(
                                cb.equal(skillJobRoot.get("id"), root.get("id")),
                                cb.like(cb.lower(skillSubJoin.get("name")), pattern)
                        ));

                // Correlated subquery: jobs where any tag name matches
                Subquery<Long> tagSub = query.subquery(Long.class);
                Root<Job> tagJobRoot = tagSub.from(Job.class);
                Join<Job, JobTag> tagSubJoin = tagJobRoot.join("tags", JoinType.INNER);
                tagSub.select(tagJobRoot.get("id"))
                        .where(cb.and(
                                cb.equal(tagJobRoot.get("id"), root.get("id")),
                                cb.like(cb.lower(tagSubJoin.get("name")), pattern)
                        ));

                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")),       pattern),
                        cb.like(cb.lower(root.get("description")), pattern),
                        cb.exists(skillSub),
                        cb.exists(tagSub)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
