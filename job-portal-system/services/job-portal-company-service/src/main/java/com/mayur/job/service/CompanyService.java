package com.mayur.job.service;

import com.mayur.job.dto.request.CompanyRequest;
import com.mayur.job.dto.response.CompanyResponse;
import com.mayur.job.domain.CompanyStatus;
import com.mayur.job.domain.CompanyType;
import com.mayur.job.domain.IndustryType;


import com.mayur.job.model.Company;

import java.util.List;

public interface CompanyService {

    CompanyResponse createCompany(Long ownerId, CompanyRequest req) throws Exception;

    CompanyResponse getCompanyById(Long id) throws Exception;

//    CompanySummaryResponse getCompanySummaryById(Long id) throws ResourceNotFoundException;

    CompanyResponse getMyCompany(Long ownerId) throws Exception;

    List<CompanyResponse> getAllCompanies(
            CompanyType companyType,
            IndustryType industryType,
            CompanyStatus status);

    CompanyResponse updateCompany(Long companyId,
                                  Long ownerId, CompanyRequest req) throws Exception;

    CompanyResponse verifyCompany(Long companyId) throws Exception;

    CompanyResponse deactivateCompany(Long companyId) throws Exception;

    void deleteCompany(Long companyId, Long ownerId) throws Exception;

    /** Used internally by other services (e.g. location service). */
    Company getCompanyEntityById(Long id) throws Exception;

    CompanyResponse getCompanySummaryById(Long id) throws Exception;
}
