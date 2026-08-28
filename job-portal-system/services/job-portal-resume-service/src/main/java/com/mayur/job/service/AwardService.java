package com.mayur.job.service;

import com.mayur.job.dto.response.AwardResponse;
import com.mayur.job.dto.resume.request.AddAwardRequest;

import java.util.List;

public interface AwardService {

    AwardResponse addAward(Long resumeId, Long candidateId, AddAwardRequest req)
            throws Exception;

    List<AwardResponse> getAwards(Long resumeId) throws Exception;

    AwardResponse updateAward(Long awardId, Long resumeId, Long candidateId, AddAwardRequest req)
            throws Exception;

    void deleteAward(Long awardId, Long resumeId, Long candidateId) throws Exception;
}
