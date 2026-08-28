package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobPreferenceResponse {

    private Long id;
    private Long candidateId;
    private Boolean isOpenToWork;
    private Integer noticePeriodDays;
    private Boolean willingToRelocate;
    private List<String> desiredJobTitles;
    private List<JobType> desiredJobTypes;
    private List<WorkMode> desiredWorkModes;
    private List<ExperienceLevel> desiredExperienceLevels;
    private List<IndustryType> desiredIndustries;
    private List<CompanySize> preferredCompanySizes;
    private List<String> preferredLocations;
    private BigDecimal minExpectedSalary;
    private BigDecimal maxExpectedSalary;
    private String expectedSalaryCurrency;
    private SalaryPeriod expectedSalaryPeriod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
