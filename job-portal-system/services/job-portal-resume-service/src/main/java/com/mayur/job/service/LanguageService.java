package com.mayur.job.service;

import com.mayur.job.dto.response.LanguageResponse;
import com.mayur.job.dto.resume.request.AddLanguageRequest;

import java.util.List;

public interface LanguageService {

    LanguageResponse addLanguage(Long resumeId, Long candidateId, AddLanguageRequest req)
            throws Exception;

    List<LanguageResponse> getLanguages(Long resumeId) throws Exception;

    LanguageResponse updateLanguage(Long languageId, Long resumeId, Long candidateId,
                                    AddLanguageRequest req) throws Exception;

    void deleteLanguage(Long languageId, Long resumeId, Long candidateId)
            throws Exception;
}
