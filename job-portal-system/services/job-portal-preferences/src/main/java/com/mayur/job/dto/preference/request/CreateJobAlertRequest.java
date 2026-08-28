package com.mayur.job.dto.preference.request;

import com.mayur.job.domain.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateJobAlertRequest {

    private String alertName;
    private AlertFrequency frequency;
    private String keywords;
    private List<String> locations;
    private List<JobType> jobTypes;
    private List<WorkMode> workModes;
    private List<ExperienceLevel> experienceLevels;
    private List<IndustryType> industries;
    private BigDecimal minSalary;
    private String salaryCurrency;
    private SalaryPeriod salaryPeriod;
}
