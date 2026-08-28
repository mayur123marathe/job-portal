package com.mayur.job.repository;

import com.mayur.job.entity.ApplicationScreening;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationScreeningRepository extends JpaRepository<ApplicationScreening, Long> {

    Optional<ApplicationScreening> findByApplicationId(Long applicationId);

    List<ApplicationScreening> findByApplicationIdIn(List<Long> applicationIds);
}
