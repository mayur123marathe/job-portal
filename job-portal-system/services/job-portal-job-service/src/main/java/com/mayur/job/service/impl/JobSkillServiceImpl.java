package com.mayur.job.service.impl;

import com.mayur.job.domain.SkillCategory;
import com.mayur.job.dto.response.JobSkillResponse;

import com.mayur.job.dto.request.BulkJobSkillRequest;
import com.mayur.job.dto.request.JobSkillRequest;
import com.mayur.job.dto.response.BulkJobSkillFailure;
import com.mayur.job.dto.response.BulkJobSkillResponse;
import com.mayur.job.modal.JobSkill;
import com.mayur.job.mapper.JobMapper;
import com.mayur.job.repository.JobSkillRepository;
import com.mayur.job.service.JobSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobSkillServiceImpl implements JobSkillService {

    private final JobSkillRepository skillRepository;

    // ── Create ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public JobSkillResponse createSkill(JobSkillRequest req) throws Exception {
        if (skillRepository.existsByName(req.getName())) {
            throw new Exception("Skill '" + req.getName() + "' already exists");
        }
        String slug = generateUniqueSlug(req.getName());

        JobSkill skill = JobSkill.builder()
                .name(req.getName())
                .slug(slug)
                .category(req.getCategory())
                .build();

        return JobMapper.toSkillResponse(skillRepository.save(skill));
    }

    @Override
    public BulkJobSkillResponse createSkillsBulk(BulkJobSkillRequest req) {
        List<JobSkillResponse>   succeeded = new ArrayList<>();
        List<BulkJobSkillFailure> failed   = new ArrayList<>();

        List<JobSkillRequest> skills = req.getSkills();
        for (int i = 0; i < skills.size(); i++) {
            JobSkillRequest skillReq = skills.get(i);
            try {
                succeeded.add(createSkill(skillReq));
            } catch (Exception e) {
                failed.add(BulkJobSkillFailure.builder()
                        .index(i)
                        .name(skillReq.getName())
                        .error(e.getMessage())
                        .build());
            }
        }

        return BulkJobSkillResponse.builder()
                .totalRequested(skills.size())
                .totalSucceeded(succeeded.size())
                .totalFailed(failed.size())
                .succeeded(succeeded)
                .failed(failed)
                .build();
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<JobSkillResponse> getAllSkills() {
        return skillRepository.findByActiveTrue().stream()
                .map(JobMapper::toSkillResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobSkillResponse> getSkillsByCategory(SkillCategory category) {
        return skillRepository.findByCategoryAndActiveTrue(category).stream()
                .map(JobMapper::toSkillResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobSkillResponse> searchSkills(String keyword) {
        return skillRepository.findByNameContainingIgnoreCaseAndActiveTrue(keyword).stream()
                .map(JobMapper::toSkillResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public JobSkillResponse getSkillById(Long id) throws Exception {
        return JobMapper.toSkillResponse(getSkillEntityById(id));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public JobSkillResponse updateSkill(Long id, JobSkillRequest req)
            throws Exception {
        JobSkill skill = getSkillEntityById(id);

        if (!skill.getName().equals(req.getName())
                && skillRepository.existsByName(req.getName())) {
            throw new Exception("Skill '" + req.getName() + "' already exists");
        }

        skill.setName(req.getName());
        skill.setCategory(req.getCategory());
        return JobMapper.toSkillResponse(skillRepository.save(skill));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void deleteSkill(Long id) throws Exception {
        JobSkill skill = getSkillEntityById(id);
        skill.setActive(false);
        skillRepository.save(skill);
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Set<JobSkill> getSkillEntitiesByIds(Set<Long> ids) throws Exception {
        Set<JobSkill> skills = new HashSet<>(skillRepository.findAllById(ids));
        if (skills.size() != ids.size()) {
            throw new Exception("One or more skill IDs are invalid");
        }
        return skills;
    }

    // ── Private utilities ─────────────────────────────────────────────────────

    private JobSkill getSkillEntityById(Long id) throws Exception {
        return skillRepository.findById(id)
                .orElseThrow(() -> new Exception(
                        "Job skill not found with id: " + id));
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("[\\s-]+", "-");
        if (!skillRepository.existsBySlug(base)) {
            return base;
        }
        int counter = 1;
        while (skillRepository.existsBySlug(base + "-" + counter)) {
            counter++;
        }
        return base + "-" + counter;
    }
}
