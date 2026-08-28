package com.mayur.job.service.impl;

import com.mayur.job.dto.response.SavedJobResponse;
import com.mayur.job.dto.preference.request.SaveJobRequest;
import com.mayur.job.entity.SavedJob;
import com.mayur.job.mapper.PreferenceMapper;
import com.mayur.job.repository.SavedJobRepository;
import com.mayur.job.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;

    @Override
    @Transactional
    public SavedJobResponse saveJob(Long candidateId, SaveJobRequest req) throws Exception {
        if (savedJobRepository.existsByCandidateIdAndJobId(candidateId, req.getJobId())) {
            throw new Exception("Job is already saved");
        }

        SavedJob savedJob = SavedJob.builder()
                .candidateId(candidateId)
                .jobId(req.getJobId())
                .companyId(req.getCompanyId())
                .notes(req.getNotes())
                .build();

        return PreferenceMapper.toSavedJobResponse(savedJobRepository.save(savedJob));
    }

    @Override
    @Transactional
    public void unsaveJob(Long candidateId, Long savedJobId) throws Exception {
        SavedJob savedJob = savedJobRepository.findById(savedJobId)
                .orElseThrow(() -> new Exception(
                        "Saved job not found with id: " + savedJobId));
        if (!savedJob.getCandidateId().equals(candidateId)) {
            throw new Exception("Saved job not found with id: " + savedJobId);
        }
        savedJobRepository.delete(savedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavedJobResponse> getMySavedJobs(Long candidateId) {
        return savedJobRepository.findByCandidateIdOrderBySavedAtDesc(candidateId)
                .stream().map(PreferenceMapper::toSavedJobResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSaved(Long candidateId, Long jobId) {
        return savedJobRepository.existsByCandidateIdAndJobId(candidateId, jobId);
    }
}
