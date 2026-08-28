package com.mayur.job.service.impl;


import com.mayur.job.dto.resume.request.CreateResumeRequest;
import com.mayur.job.dto.resume.request.UpdatePersonalInfoRequest;
import com.mayur.job.dto.resume.request.UpdateResumeRequest;
import com.mayur.job.dto.resume.response.ResumeResponse;
import com.mayur.job.modal.*;
import com.mayur.job.modal.embeddable.PersonalInfo;
import com.mayur.job.mapper.ResumeMapper;
import com.mayur.job.repository.*;
import com.mayur.job.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {

    private final ResumeRepository resumeRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final EducationRepository educationRepository;
    private final ResumeSkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final CertificationRepository certificationRepository;
    private final AwardRepository awardRepository;
    private final LanguageRepository languageRepository;

    @Override
    @Transactional
    public ResumeResponse createResume(Long candidateId, CreateResumeRequest req) {
        // If this should be default, clear any existing default
        if (Boolean.TRUE.equals(req.getIsDefault())) {
            resumeRepository.findByCandidateIdAndIsDefaultTrue(candidateId)
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        resumeRepository.save(existing);
                    });
        }

        Resume resume = Resume.builder()
                .candidateId(candidateId)
                .title(req.getTitle())
                .template(req.getTemplate())
                .visibility(req.getVisibility())
                .isDefault(Boolean.TRUE.equals(req.getIsDefault()))
                .build();

        resume = resumeRepository.save(resume);
        return buildFullResponse(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeResponse getResumeById(Long resumeId, Long candidateId) throws Exception {
        Resume resume = getResumeEntity(resumeId);
        assertOwner(resume, candidateId);
        return buildFullResponse(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeResponse> getMyResumes(Long candidateId) {
        return resumeRepository.findByCandidateIdAndActiveTrue(candidateId)
                .stream()
                .map(this::buildFullResponse)
                .toList();
    }

    @Override
    @Transactional
    public ResumeResponse updatePersonalInfo(Long resumeId, Long candidateId,
                                             UpdatePersonalInfoRequest req) throws Exception {
        Resume resume = getResumeEntity(resumeId);
        assertOwner(resume, candidateId);

        PersonalInfo info = resume.getPersonalInfo();
        if (info == null) info = new PersonalInfo();

        if (req.getFirstName() != null)
            info.setFirstName(req.getFirstName());
        if (req.getLastName() != null) info.setLastName(req.getLastName());
        if (req.getHeadline() != null) info.setHeadline(req.getHeadline());
        if (req.getEmail() != null) info.setEmail(req.getEmail());
        if (req.getPhone() != null) info.setPhone(req.getPhone());
        if (req.getCity() != null) info.setCity(req.getCity());
        if (req.getCountry() != null) info.setCountry(req.getCountry());
        if (req.getLinkedinUrl() != null) info.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getGithubUrl() != null) info.setGithubUrl(req.getGithubUrl());
        if (req.getPortfolioUrl() != null) info.setPortfolioUrl(req.getPortfolioUrl());
        if (req.getWebsiteUrl() != null) info.setWebsiteUrl(req.getWebsiteUrl());
        if (req.getProfileImage() != null) info.setProfileImage(req.getProfileImage());

        resume.setPersonalInfo(info);
        resume = resumeRepository.save(resume);
        return buildFullResponse(resume);
    }

    @Override
    @Transactional
    public ResumeResponse updateSummary(Long resumeId, Long candidateId, String summary)
            throws Exception {
        Resume resume = getResumeEntity(resumeId);
        assertOwner(resume, candidateId);
        resume.setSummary(summary);
        resume = resumeRepository.save(resume);
        return buildFullResponse(resume);
    }

    @Override
    @Transactional
    public ResumeResponse updateResume(Long resumeId, Long candidateId, UpdateResumeRequest req)
            throws Exception {
        Resume resume = getResumeEntity(resumeId);
        assertOwner(resume, candidateId);
        if (req.getTitle() != null)      resume.setTitle(req.getTitle());
        if (req.getTemplate() != null)   resume.setTemplate(req.getTemplate());
        if (req.getVisibility() != null) resume.setVisibility(req.getVisibility());
        resume = resumeRepository.save(resume);
        return buildFullResponse(resume);
    }

    @Override
    @Transactional
    public ResumeResponse setDefaultResume(Long resumeId, Long candidateId)
            throws Exception {
        Resume resume = getResumeEntity(resumeId);
        assertOwner(resume, candidateId);

        // Clear existing default
        resumeRepository.findByCandidateIdAndIsDefaultTrue(candidateId)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(resumeId)) {
                        existing.setIsDefault(false);
                        resumeRepository.save(existing);
                    }
                });

        resume.setIsDefault(true);
        resume = resumeRepository.save(resume);
        return buildFullResponse(resume);
    }

    @Override
    @Transactional
    public void deleteResume(Long resumeId, Long candidateId) throws Exception {
        Resume resume = getResumeEntity(resumeId);
        assertOwner(resume, candidateId);
        resume.setActive(false);
        resumeRepository.save(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public Resume getResumeEntity(Long resumeId) throws Exception {
        return resumeRepository.findById(resumeId)
                .orElseThrow(() -> new Exception("Resume not found with id: " + resumeId));
    }

    private void assertOwner(Resume resume, Long candidateId) throws Exception {
        if (!resume.getCandidateId().equals(candidateId)) {
            throw new Exception("Resume not found with id: " + resume.getId());
        }
    }

    private ResumeResponse buildFullResponse(Resume resume) {
        List<WorkExperience> workExperiences = workExperienceRepository
                .findByResume_IdOrderByDisplayOrderAsc(resume.getId());
        List<Education> educations = educationRepository
                .findByResume_IdOrderByDisplayOrderAsc(resume.getId());
        List<ResumeSkill> skills = skillRepository
                .findByResume_IdOrderByDisplayOrderAsc(resume.getId());
        List<Project> projects = projectRepository
                .findByResume_IdOrderByDisplayOrderAsc(resume.getId());
        List<Certification> certifications = certificationRepository
                .findByResume_IdOrderByDisplayOrderAsc(resume.getId());
        List<Award> awards = awardRepository
                .findByResume_IdOrderByDisplayOrderAsc(resume.getId());
        List<Language> languages = languageRepository
                .findByResume_IdOrderByDisplayOrderAsc(resume.getId());

        return ResumeMapper.toResponse(resume, workExperiences, educations, skills,
                projects, certifications, awards, languages);
    }
}
