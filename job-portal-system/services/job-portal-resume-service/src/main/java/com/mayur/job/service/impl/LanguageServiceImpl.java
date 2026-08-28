package com.mayur.job.service.impl;

import com.mayur.job.dto.response.LanguageResponse;
import com.mayur.job.dto.resume.request.AddLanguageRequest;
import com.mayur.job.modal.Language;
import com.mayur.job.modal.Resume;
import com.mayur.job.mapper.ResumeMapper;
import com.mayur.job.repository.LanguageRepository;
import com.mayur.job.service.LanguageService;
import com.mayur.job.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LanguageServiceImpl implements LanguageService {

    private final LanguageRepository languageRepository;
    private final ResumeService resumeService;

    @Override
    @Transactional
    public LanguageResponse addLanguage(Long resumeId, Long candidateId, AddLanguageRequest req)
            throws Exception {
        Resume resume = resumeService.getResumeEntity(resumeId);
        assertOwner(resume, candidateId, resumeId);

        Language lang = Language.builder()
                .resume(resume)
                .languageName(req.getLanguageName())
                .proficiency(req.getProficiency())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();

        return ResumeMapper.toLanguageResponse(languageRepository.save(lang));
    }

    @Override
    @Transactional(readOnly = true)
    public List<LanguageResponse> getLanguages(Long resumeId) throws Exception {
        resumeService.getResumeEntity(resumeId);
        return languageRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId)
                .stream().map(ResumeMapper::toLanguageResponse).toList();
    }

    @Override
    @Transactional
    public LanguageResponse updateLanguage(Long languageId, Long resumeId, Long candidateId,
                                           AddLanguageRequest req) throws Exception {
        Language lang = getLanguageEntity(languageId, resumeId);
        assertOwner(lang.getResume(), candidateId, resumeId);

        lang.setLanguageName(req.getLanguageName());
        lang.setProficiency(req.getProficiency());
        if (req.getDisplayOrder() != null) lang.setDisplayOrder(req.getDisplayOrder());

        return ResumeMapper.toLanguageResponse(languageRepository.save(lang));
    }

    @Override
    @Transactional
    public void deleteLanguage(Long languageId, Long resumeId, Long candidateId)
            throws Exception {
        Language lang = getLanguageEntity(languageId, resumeId);
        assertOwner(lang.getResume(), candidateId, resumeId);
        languageRepository.delete(lang);
    }

    private Language getLanguageEntity(Long languageId, Long resumeId) throws Exception {
        Language lang = languageRepository.findById(languageId)
                .orElseThrow(() -> new Exception(
                        "Language not found with id: " + languageId));
        if (!lang.getResume().getId().equals(resumeId)) {
            throw new Exception("Language not found with id: " + languageId);
        }
        return lang;
    }

    private void assertOwner(Resume resume, Long candidateId, Long resumeId)
            throws Exception {
        if (!resume.getCandidateId().equals(candidateId)) {
            throw new Exception("Resume not found with id: " + resumeId);
        }
    }
}
