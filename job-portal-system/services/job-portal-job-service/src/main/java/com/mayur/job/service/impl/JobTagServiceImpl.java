package com.mayur.job.service.impl;

import com.mayur.job.dto.response.JobTagResponse;

import com.mayur.job.dto.request.BulkJobTagRequest;
import com.mayur.job.dto.request.JobTagRequest;
import com.mayur.job.dto.response.BulkJobTagFailure;
import com.mayur.job.dto.response.BulkJobTagResponse;
import com.mayur.job.modal.JobTag;
import com.mayur.job.mapper.JobMapper;
import com.mayur.job.repository.JobTagRepository;
import com.mayur.job.service.JobTagService;
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
public class JobTagServiceImpl implements JobTagService {

    private final JobTagRepository tagRepository;

    // ── Create ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public JobTagResponse createTag(JobTagRequest req) throws Exception {
        if (tagRepository.existsByName(req.getName())) {
            throw new Exception("Tag '" + req.getName() + "' already exists");
        }
        String slug = generateUniqueSlug(req.getName());

        JobTag tag = JobTag.builder()
                .name(req.getName())
                .slug(slug)
                .build();

        return JobMapper.toTagResponse(tagRepository.save(tag));
    }

    @Override
    public BulkJobTagResponse createTagsBulk(BulkJobTagRequest req) {
        List<JobTagResponse>   succeeded = new ArrayList<>();
        List<BulkJobTagFailure> failed   = new ArrayList<>();

        List<JobTagRequest> tags = req.getTags();
        for (int i = 0; i < tags.size(); i++) {
            JobTagRequest tagReq = tags.get(i);
            try {
                succeeded.add(createTag(tagReq));
            } catch (Exception e) {
                failed.add(BulkJobTagFailure.builder()
                        .index(i)
                        .name(tagReq.getName())
                        .error(e.getMessage())
                        .build());
            }
        }

        return BulkJobTagResponse.builder()
                .totalRequested(tags.size())
                .totalSucceeded(succeeded.size())
                .totalFailed(failed.size())
                .succeeded(succeeded)
                .failed(failed)
                .build();
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<JobTagResponse> getAllTags() {
        return tagRepository.findAll().stream()
                .map(JobMapper::toTagResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobTagResponse> searchTags(String keyword) {
        return tagRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(JobMapper::toTagResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public JobTagResponse getTagById(Long id) throws Exception {
        return JobMapper.toTagResponse(getTagEntityById(id));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public JobTagResponse updateTag(Long id, JobTagRequest req)
            throws Exception {
        JobTag tag = getTagEntityById(id);

        if (!tag.getName().equals(req.getName()) && tagRepository.existsByName(req.getName())) {
            throw new Exception("Tag '" + req.getName() + "' already exists");
        }

        tag.setName(req.getName());
        return JobMapper.toTagResponse(tagRepository.save(tag));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void deleteTag(Long id) throws Exception {
        tagRepository.delete(getTagEntityById(id));
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Set<JobTag> getTagEntitiesByIds(Set<Long> ids) throws Exception {
        Set<JobTag> tags = new HashSet<>(tagRepository.findAllById(ids));
        if (tags.size() != ids.size()) {
            throw new Exception("One or more tag IDs are invalid");
        }
        return tags;
    }

    // ── Private utilities ─────────────────────────────────────────────────────

    private JobTag getTagEntityById(Long id) throws Exception {
        return tagRepository.findById(id)
                .orElseThrow(() -> new Exception(
                        "Job tag not found with id: " + id));
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("[\\s-]+", "-");
        if (!tagRepository.existsBySlug(base)) {
            return base;
        }
        int counter = 1;
        while (tagRepository.existsBySlug(base + "-" + counter)) {
            counter++;
        }
        return base + "-" + counter;
    }
}
