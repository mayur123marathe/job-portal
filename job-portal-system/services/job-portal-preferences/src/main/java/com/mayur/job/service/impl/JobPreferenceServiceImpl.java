package com.mayur.job.service.impl;

import com.mayur.job.dto.response.JobPreferenceResponse;
import com.mayur.job.dto.preference.request.UpdateJobPreferenceRequest;
import com.mayur.job.entity.JobPreference;
import com.mayur.job.mapper.PreferenceMapper;
import com.mayur.job.repository.JobPreferenceRepository;
import com.mayur.job.service.JobPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobPreferenceServiceImpl implements JobPreferenceService {

    private final JobPreferenceRepository preferenceRepository;

    @Override
    @Transactional
    public JobPreferenceResponse getOrCreatePreference(Long candidateId) {
        JobPreference pref = preferenceRepository.findByCandidateId(candidateId)
                .orElseGet(() -> preferenceRepository.save(
                        JobPreference.builder().candidateId(candidateId).build()));
        return PreferenceMapper.toPreferenceResponse(pref);
    }

    @Override
    @Transactional
    public JobPreferenceResponse updatePreference(Long candidateId, UpdateJobPreferenceRequest req) {
        JobPreference pref = preferenceRepository.findByCandidateId(candidateId)
                .orElseGet(() -> JobPreference.builder().candidateId(candidateId).build());

        if (req.getIsOpenToWork() != null) pref.setIsOpenToWork(req.getIsOpenToWork());
        if (req.getNoticePeriodDays() != null) pref.setNoticePeriodDays(req.getNoticePeriodDays());
        if (req.getWillingToRelocate() != null) pref.setWillingToRelocate(req.getWillingToRelocate());
        if (req.getDesiredJobTitles() != null) pref.setDesiredJobTitles(req.getDesiredJobTitles());
        if (req.getDesiredJobTypes() != null) pref.setDesiredJobTypes(req.getDesiredJobTypes());
        if (req.getDesiredWorkModes() != null) pref.setDesiredWorkModes(req.getDesiredWorkModes());
        if (req.getDesiredExperienceLevels() != null) pref.setDesiredExperienceLevels(req.getDesiredExperienceLevels());
        if (req.getDesiredIndustries() != null) pref.setDesiredIndustries(req.getDesiredIndustries());
        if (req.getPreferredCompanySizes() != null) pref.setPreferredCompanySizes(req.getPreferredCompanySizes());
        if (req.getPreferredLocations() != null) pref.setPreferredLocations(req.getPreferredLocations());
        if (req.getMinExpectedSalary() != null) pref.setMinExpectedSalary(req.getMinExpectedSalary());
        if (req.getMaxExpectedSalary() != null) pref.setMaxExpectedSalary(req.getMaxExpectedSalary());
        if (req.getExpectedSalaryCurrency() != null) pref.setExpectedSalaryCurrency(req.getExpectedSalaryCurrency());
        if (req.getExpectedSalaryPeriod() != null) pref.setExpectedSalaryPeriod(req.getExpectedSalaryPeriod());

        return PreferenceMapper.toPreferenceResponse(preferenceRepository.save(pref));
    }
}
