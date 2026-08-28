package com.mayur.job.repository;

import com.mayur.job.domain.ParseStatus;
import com.mayur.job.modal.ResumeParseJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeParseJobRepository extends JpaRepository<ResumeParseJob, Long> {

    List<ResumeParseJob> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);

    List<ResumeParseJob> findByStatus(ParseStatus status);
}
