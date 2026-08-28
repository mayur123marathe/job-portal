package com.mayur.job.repository;

import com.mayur.job.modal.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByCandidateIdAndActiveTrue(Long candidateId);

    Optional<Resume> findByCandidateIdAndIsDefaultTrue(Long candidateId);

    boolean existsByCandidateIdAndIsDefaultTrue(Long candidateId);

    long countByCandidateIdAndActiveTrue(Long candidateId);
}
