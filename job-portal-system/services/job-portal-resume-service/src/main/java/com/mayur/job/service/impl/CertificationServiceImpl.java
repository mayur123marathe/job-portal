package com.mayur.job.service.impl;

import com.mayur.job.dto.response.CertificationResponse;
import com.mayur.job.dto.resume.request.AddCertificationRequest;
import com.mayur.job.modal.Certification;
import com.mayur.job.modal.Resume;
import com.mayur.job.mapper.ResumeMapper;
import com.mayur.job.repository.CertificationRepository;
import com.mayur.job.service.CertificationService;
import com.mayur.job.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationServiceImpl implements CertificationService {

    private final CertificationRepository certificationRepository;
    private final ResumeService resumeService;

    @Override
    @Transactional
    public CertificationResponse addCertification(Long resumeId, Long candidateId,
                                                  AddCertificationRequest req) throws Exception {
        Resume resume = resumeService.getResumeEntity(resumeId);
        assertOwner(resume, candidateId, resumeId);

        Certification cert = Certification.builder()
                .resume(resume)
                .name(req.getName())
                .issuingOrganization(req.getIssuingOrganization())
                .issueDate(req.getIssueDate())
                .expiryDate(req.getExpiryDate())
                .credentialId(req.getCredentialId())
                .credentialUrl(req.getCredentialUrl())
                .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 0)
                .build();

        return ResumeMapper.toCertificationResponse(certificationRepository.save(cert));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CertificationResponse> getCertifications(Long resumeId) throws Exception {
        resumeService.getResumeEntity(resumeId);
        return certificationRepository.findByResume_IdOrderByDisplayOrderAsc(resumeId)
                .stream().map(ResumeMapper::toCertificationResponse).toList();
    }

    @Override
    @Transactional
    public CertificationResponse updateCertification(Long certificationId, Long resumeId,
                                                     Long candidateId, AddCertificationRequest req) throws Exception {
        Certification cert = getCertificationEntity(certificationId, resumeId);
        assertOwner(cert.getResume(), candidateId, resumeId);

        cert.setName(req.getName());
        cert.setIssuingOrganization(req.getIssuingOrganization());
        cert.setIssueDate(req.getIssueDate());
        cert.setExpiryDate(req.getExpiryDate());
        cert.setCredentialId(req.getCredentialId());
        cert.setCredentialUrl(req.getCredentialUrl());
        if (req.getDisplayOrder() != null) cert.setDisplayOrder(req.getDisplayOrder());

        return ResumeMapper.toCertificationResponse(certificationRepository.save(cert));
    }

    @Override
    @Transactional
    public void deleteCertification(Long certificationId, Long resumeId, Long candidateId)
            throws Exception {
        Certification cert = getCertificationEntity(certificationId, resumeId);
        assertOwner(cert.getResume(), candidateId, resumeId);
        certificationRepository.delete(cert);
    }

    private Certification getCertificationEntity(Long certificationId, Long resumeId)
            throws Exception {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new Exception(
                        "Certification not found with id: " + certificationId));
        if (!cert.getResume().getId().equals(resumeId)) {
            throw new Exception("Certification not found with id: " + certificationId);
        }
        return cert;
    }

    private void assertOwner(Resume resume, Long candidateId, Long resumeId)
            throws Exception {
        if (!resume.getCandidateId().equals(candidateId)) {
            throw new Exception("Resume not found with id: " + resumeId);
        }
    }
}
