package com.mayur.job.repository;

import com.mayur.job.entity.JobAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobAlertRepository extends JpaRepository<JobAlert, Long> {

    List<JobAlert> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);

    List<JobAlert> findByCandidateIdAndIsActiveTrue(Long candidateId);

    List<JobAlert> findByIsActiveTrue();
}
