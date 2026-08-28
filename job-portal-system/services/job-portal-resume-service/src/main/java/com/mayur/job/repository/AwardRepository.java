package com.mayur.job.repository;

import com.mayur.job.modal.Award;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AwardRepository extends JpaRepository<Award, Long> {

    List<Award> findByResume_IdOrderByDisplayOrderAsc(Long resumeId);
}
