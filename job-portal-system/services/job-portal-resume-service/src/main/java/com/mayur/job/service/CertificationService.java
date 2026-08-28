package com.mayur.job.service;

import com.mayur.job.dto.response.CertificationResponse;
import com.mayur.job.dto.resume.request.AddCertificationRequest;

import java.util.List;

public interface CertificationService {

    CertificationResponse addCertification(Long resumeId, Long candidateId, AddCertificationRequest req)
            throws Exception;

    List<CertificationResponse> getCertifications(Long resumeId) throws Exception;

    CertificationResponse updateCertification(Long certificationId, Long resumeId, Long candidateId,
                                              AddCertificationRequest req) throws Exception;

    void deleteCertification(Long certificationId, Long resumeId, Long candidateId)
            throws Exception;
}
