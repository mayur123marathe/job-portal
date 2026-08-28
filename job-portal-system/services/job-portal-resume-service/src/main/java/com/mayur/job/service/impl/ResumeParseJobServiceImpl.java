package com.mayur.job.service.impl;

import com.mayur.job.domain.ParseStatus;
import com.mayur.job.dto.response.ResumeParseJobResponse;
import com.mayur.job.dto.resume.request.ParseResumeRequest;
import com.mayur.job.modal.ResumeParseJob;
import com.mayur.job.mapper.ResumeMapper;
import com.mayur.job.repository.ResumeParseJobRepository;
import com.mayur.job.service.ResumeParseJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeParseJobServiceImpl implements ResumeParseJobService {

    private final ResumeParseJobRepository parseJobRepository;

    @Override
    @Transactional
    public ResumeParseJobResponse submitParseJob(Long candidateId, ParseResumeRequest req) {
        ResumeParseJob job = ResumeParseJob.builder()
                .candidateId(candidateId)
                .originalFileUrl(req.getFileUrl())
                .originalFileName(req.getFileName())
                .fileType(req.getFileType())
                .status(ParseStatus.PENDING)
                .build();

        return ResumeMapper.toParseJobResponse(parseJobRepository.save(job));
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeParseJobResponse getParseJob(Long jobId, Long candidateId)
            throws Exception {
        ResumeParseJob job = parseJobRepository.findById(jobId)
                .orElseThrow(() -> new Exception(
                        "Parse job not found with id: " + jobId));
        if (!job.getCandidateId().equals(candidateId)) {
            throw new Exception("Parse job not found with id: " + jobId);
        }
        return ResumeMapper.toParseJobResponse(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeParseJobResponse> getMyParseJobs(Long candidateId) {
        return parseJobRepository.findByCandidateIdOrderByCreatedAtDesc(candidateId)
                .stream().map(ResumeMapper::toParseJobResponse).toList();
    }
}
