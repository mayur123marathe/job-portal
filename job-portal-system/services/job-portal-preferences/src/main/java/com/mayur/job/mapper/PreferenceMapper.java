package com.mayur.job.mapper;

import com.mayur.job.dto.response.JobAlertResponse;
import com.mayur.job.dto.response.JobPreferenceResponse;
import com.mayur.job.dto.response.SavedJobResponse;
import com.mayur.job.entity.JobAlert;
import com.mayur.job.entity.JobPreference;
import com.mayur.job.entity.SavedJob;

public class PreferenceMapper {

    private PreferenceMapper() {}

    public static JobPreferenceResponse toPreferenceResponse(JobPreference pref) {
        if (pref == null) return null;
        return JobPreferenceResponse.builder()
                .id(pref.getId())
                .candidateId(pref.getCandidateId())
                .isOpenToWork(pref.getIsOpenToWork())
                .noticePeriodDays(pref.getNoticePeriodDays())
                .willingToRelocate(pref.getWillingToRelocate())
                .desiredJobTitles(pref.getDesiredJobTitles())
                .desiredJobTypes(pref.getDesiredJobTypes())
                .desiredWorkModes(pref.getDesiredWorkModes())
                .desiredExperienceLevels(pref.getDesiredExperienceLevels())
                .desiredIndustries(pref.getDesiredIndustries())
                .preferredCompanySizes(pref.getPreferredCompanySizes())
                .preferredLocations(pref.getPreferredLocations())
                .minExpectedSalary(pref.getMinExpectedSalary())
                .maxExpectedSalary(pref.getMaxExpectedSalary())
                .expectedSalaryCurrency(pref.getExpectedSalaryCurrency())
                .expectedSalaryPeriod(pref.getExpectedSalaryPeriod())
                .createdAt(pref.getCreatedAt())
                .updatedAt(pref.getUpdatedAt())
                .build();
    }

    public static SavedJobResponse toSavedJobResponse(SavedJob savedJob) {
        if (savedJob == null) return null;
        return SavedJobResponse.builder()
                .id(savedJob.getId())
                .candidateId(savedJob.getCandidateId())
                .jobId(savedJob.getJobId())
                .companyId(savedJob.getCompanyId())
                .notes(savedJob.getNotes())
                .savedAt(savedJob.getSavedAt())
                .build();
    }

    public static JobAlertResponse toAlertResponse(JobAlert alert) {
        if (alert == null) return null;
        return JobAlertResponse.builder()
                .id(alert.getId())
                .candidateId(alert.getCandidateId())
                .alertName(alert.getAlertName())
                .isActive(alert.getIsActive())
                .frequency(alert.getFrequency())
                .keywords(alert.getKeywords())
                .locations(alert.getLocations())
                .jobTypes(alert.getJobTypes())
                .workModes(alert.getWorkModes())
                .experienceLevels(alert.getExperienceLevels())
                .industries(alert.getIndustries())
                .minSalary(alert.getMinSalary())
                .salaryCurrency(alert.getSalaryCurrency())
                .salaryPeriod(alert.getSalaryPeriod())
                .lastTriggeredAt(alert.getLastTriggeredAt())
                .nextScheduledAt(alert.getNextScheduledAt())
                .totalMatchesSent(alert.getTotalMatchesSent())
                .createdAt(alert.getCreatedAt())
                .updatedAt(alert.getUpdatedAt())
                .build();
    }
}
