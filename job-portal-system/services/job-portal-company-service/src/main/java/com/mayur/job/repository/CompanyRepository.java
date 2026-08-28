package com.mayur.job.repository;

import com.mayur.job.domain.CompanyStatus;
import com.mayur.job.domain.CompanyType;
import com.mayur.job.domain.IndustryType;
import com.mayur.job.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByOwnerId(Long ownerId);

    boolean existsByOwnerId(Long ownerId);

    Optional<Company> findBySlug(String slug);

    List<Company> findByStatus(CompanyStatus status);

    List<Company> findByIndustryType(IndustryType industryType);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    boolean existsByRegistrationNumber(String registrationNumber);

    @Query("SELECT c FROM Company c WHERE " +
            "(:companyType IS NULL OR c.companyType = :companyType) AND " +
            "(:industryType IS NULL OR c.industryType = :industryType) AND " +
            "(:status IS NULL OR c.status = :status)")
    List<Company> findByFilters(@Param("companyType") CompanyType companyType,
                                @Param("industryType") IndustryType industryType,
                                @Param("status") CompanyStatus status);
}
