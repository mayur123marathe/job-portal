package com.mayur.job.repository;

import com.mayur.job.domain.SkillCategory;
import com.mayur.job.modal.JobSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobSkillRepository extends JpaRepository<JobSkill, Long> {

    Optional<JobSkill> findBySlug(String slug);

    List<JobSkill> findByActiveTrue();

    List<JobSkill> findByCategoryAndActiveTrue(SkillCategory category);

    List<JobSkill> findByNameContainingIgnoreCaseAndActiveTrue(String keyword);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);
}
