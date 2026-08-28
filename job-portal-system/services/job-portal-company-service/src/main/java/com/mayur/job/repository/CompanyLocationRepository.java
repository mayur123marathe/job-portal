package com.mayur.job.repository;

import com.mayur.job.model.CompanyLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyLocationRepository extends JpaRepository<CompanyLocation, Long> {

    List<CompanyLocation> findByCompanyId(Long companyId);

    List<CompanyLocation> findByCompanyIdAndActiveTrue(Long companyId);

    Optional<CompanyLocation> findByCompanyIdAndIsHeadquarterTrue(Long companyId);

    boolean existsByCompanyIdAndIsHeadquarterTrue(Long companyId);

    int countByCompanyId(Long companyId);
}
