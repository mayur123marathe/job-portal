package com.mayur.job.repository;

import com.mayur.job.modal.Certification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Long> {

    List<Certification> findByResume_IdOrderByDisplayOrderAsc(Long resumeId);
}
