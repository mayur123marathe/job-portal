package com.mayur.job.service.impl;

import com.mayur.job.dto.response.EducationResponse;

import com.mayur.job.dto.resume.request.AddEducationRequest;
import com.mayur.job.modal.Education;
import com.mayur.job.modal.Resume;
import com.mayur.job.mapper.ResumeMapper;
import com.mayur.job.repository.EducationRepository;
import com.mayur.job.service.EducationService;
import com.mayur.job.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;
    private final ResumeService resumeService;

    @Override
    @Transactional
    public EducationResponse addEducation(Long resumeId, Long candidateId, AddEducationRequest req)
            throws Exception {
        Resume resume = resumeService.getResumeEntity(resumeId);
        assertOwner(resume, candidateId, resumeId);

        Education edu = Education.builder()
                .resume(resume)
                .institutionName(req.getInstitutionName())
                .degree(req.getDegree())
                .fieldOfStudy(req.getFieldOfStudy())
                .grade(req.getGrade())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .isCurrentlyStudying(Boolean.TRUE.equals(req.getIsCurrentlyStudying()))
                .description(req.getDescription())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();

        return ResumeMapper.toEducationResponse(educationRepository.save(edu));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EducationResponse> getEducations(Long resumeId) throws Exception {
        resumeService.getResumeEntity(resumeId);
        return educationRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId)
                .stream().map(ResumeMapper::toEducationResponse).toList();
    }

    @Override
    @Transactional
    public EducationResponse updateEducation(Long educationId, Long resumeId, Long candidateId,
                                             AddEducationRequest req) throws Exception {
        Education edu = getEducationEntity(educationId, resumeId);
        assertOwner(edu.getResume(), candidateId, resumeId);

        edu.setInstitutionName(req.getInstitutionName());
        edu.setDegree(req.getDegree());
        edu.setFieldOfStudy(req.getFieldOfStudy());
        edu.setGrade(req.getGrade());
        edu.setStartDate(req.getStartDate());
        edu.setEndDate(req.getEndDate());
        edu.setIsCurrentlyStudying(Boolean.TRUE.equals(req.getIsCurrentlyStudying()));
        edu.setDescription(req.getDescription());
        if (req.getDisplayOrder() != null) edu.setDisplayOrder(req.getDisplayOrder());

        return ResumeMapper.toEducationResponse(educationRepository.save(edu));
    }

    @Override
    @Transactional
    public void deleteEducation(Long educationId, Long resumeId, Long candidateId)
            throws Exception {
        Education edu = getEducationEntity(educationId, resumeId);
        assertOwner(edu.getResume(), candidateId, resumeId);
        educationRepository.delete(edu);
    }

    private Education getEducationEntity(Long educationId, Long resumeId)
            throws Exception {
        Education edu = educationRepository.findById(educationId)
                .orElseThrow(() -> new Exception(
                        "Education not found with id: " + educationId));
        if (!edu.getResume().getId().equals(resumeId)) {
            throw new Exception("Education not found with id: " + educationId);
        }
        return edu;
    }

    private void assertOwner(Resume resume, Long candidateId, Long resumeId)
            throws Exception {
        if (!resume.getCandidateId().equals(candidateId)) {
            throw new Exception("Resume not found with id: " + resumeId);
        }
    }
}
