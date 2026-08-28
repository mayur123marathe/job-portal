package com.mayur.job.service;

import com.mayur.job.client.AiClient;
import com.mayur.job.client.JobClient;
import com.mayur.job.client.ResumeClient;
import com.mayur.job.domain.AiShortlistStatus;
import com.mayur.job.dto.response.EducationResponse;
import com.mayur.job.dto.response.JobResponse;
import com.mayur.job.dto.response.JobSkillResponse;
import com.mayur.job.dto.response.ResumeResponse;
import com.mayur.job.dto.response.ResumeSkillResponse;
import com.mayur.job.dto.response.WorkExperienceResponse;
import com.mayur.job.dto.application.request.ScreeningScoreRequest;
import com.mayur.job.dto.application.response.ScreeningScoreResponse;
import com.mayur.job.entity.Application;
import com.mayur.job.entity.ApplicationScreening;
import com.mayur.job.repository.ApplicationRepository;
import com.mayur.job.repository.ApplicationScreeningRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationScreeningService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationScreeningRepository screeningRepository;
    private final JobClient jobClient;
    private final ResumeClient resumeClient;
    private final AiClient aiClient;

    /**
     * Runs in a background thread — caller returns immediately.
     * Retries the AI call up to 3 times with exponential backoff before giving up.
     */
    @Async("screeningExecutor")
    @Transactional
    public void screenAsync(Long applicationId, Long candidateId, Long jobId, Long resumeId) {
        log.info("Background screening started — applicationId={}", applicationId);
        try {
            // 1. Fetch job + resume data
            JobResponse job = jobClient.getJobById(jobId);
            ResumeResponse resume = resumeClient.getResumeById(resumeId, candidateId);

            // 2. Build AI request
            List<String> requiredSkills = job.getSkills() != null
                    ? job.getSkills().stream().map(JobSkillResponse::getName).collect(Collectors.toList())
                    : Collections.emptyList();

            List<String> candidateSkills = resume.getSkills() != null
                    ? resume.getSkills().stream().map(ResumeSkillResponse::getSkillName).collect(Collectors.toList())
                    : Collections.emptyList();

            List<String> candidateExperience = resume.getWorkExperiences() != null
                    ? resume.getWorkExperiences().stream()
                    .map(ApplicationScreeningService::formatExperience)
                    .collect(Collectors.toList())
                    : Collections.emptyList();

            List<String> candidateEducation = resume.getEducations() != null
                    ? resume.getEducations().stream()
                    .map(ApplicationScreeningService::formatEducation)
                    .collect(Collectors.toList())
                    : Collections.emptyList();

            ScreeningScoreRequest request = ScreeningScoreRequest.builder()
                    .jobTitle(job.getTitle())
                    .experienceLevel(job.getExperienceLevel() != null ? job.getExperienceLevel().name() : null)
                    .requiredSkills(requiredSkills)
                    .responsibilities(job.getResponsibilities())
                    .candidateSummary(resume.getSummary())
                    .candidateSkills(candidateSkills)
                    .candidateExperience(candidateExperience)
                    .candidateEducation(candidateEducation)
                    .build();

            // 3. Call AI service with retry (max 3 attempts, exponential backoff)
            ScreeningScoreResponse result = callAiWithRetry(request, applicationId);

            // 4. Resolve shortlist category
            AiShortlistStatus shortlistStatus = resolveStatus(result.getScore());

            // 5. Save full screening detail
            screeningRepository.save(ApplicationScreening.builder()
                    .applicationId(applicationId)
                    .overallScore(result.getScore())
                    .skillsMatchScore(result.getSkillsMatchScore())
                    .experienceMatchScore(result.getExperienceMatchScore())
                    .educationMatchScore(result.getEducationMatchScore())
                    .shortlistStatus(shortlistStatus)
                    .summary(result.getSummary())
                    .matchedSkills(result.getMatchedSkills())
                    .missingSkills(result.getMissingSkills())
                    .strengths(result.getStrengths())
                    .concerns(result.getConcerns())
                    .build());

            // 6. Denormalize score onto Application for fast filtering
            applicationRepository.findById(applicationId).ifPresent(app -> {
                app.setAiScore(result.getScore());
                app.setAiShortlistStatus(shortlistStatus);
                applicationRepository.save(app);
            });

            log.info("Screening complete — applicationId={}, score={}, status={}",
                    applicationId, result.getScore(), shortlistStatus);

        } catch (Exception ex) {
            log.error("Screening failed for applicationId={}: {}", applicationId, ex.getMessage(), ex);
            // Fail silently — employer sees "Not Screened" until a re-trigger is added.
        }
    }

    private ScreeningScoreResponse callAiWithRetry(ScreeningScoreRequest request, Long applicationId) {
        int maxAttempts = 3;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return aiClient.scoreCandidate(request).getData();
            } catch (Exception ex) {
                if (attempt == maxAttempts) {
                    throw ex;
                }
                log.warn("AI scoring attempt {}/{} failed for applicationId={}, retrying in {}s...",
                        attempt, maxAttempts, applicationId, attempt);
                try {
                    Thread.sleep(1000L * attempt);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Screening interrupted", ie);
                }
            }
        }
        throw new IllegalStateException("unreachable");
    }

    private static AiShortlistStatus resolveStatus(int score) {
        if (score >= 90) return AiShortlistStatus.AUTO_SHORTLISTED;
        if (score >= 75) return AiShortlistStatus.REVIEW_RECOMMENDED;
        if (score >= 50) return AiShortlistStatus.PENDING_REVIEW;
        return AiShortlistStatus.LOW_MATCH;
    }

    private static String formatExperience(WorkExperienceResponse w) {
        StringBuilder sb = new StringBuilder();
        if (w.getJobTitle() != null)    sb.append(w.getJobTitle());
        if (w.getCompanyName() != null) sb.append(" at ").append(w.getCompanyName());
        if (w.getDescription() != null) sb.append(": ").append(w.getDescription());
        return sb.toString();
    }

    private static String formatEducation(EducationResponse e) {
        StringBuilder sb = new StringBuilder();
        if (e.getDegree() != null)          sb.append(e.getDegree());
        if (e.getFieldOfStudy() != null)    sb.append(" in ").append(e.getFieldOfStudy());
        if (e.getInstitutionName() != null) sb.append(" from ").append(e.getInstitutionName());
        if (e.getGrade() != null)           sb.append(" (").append(e.getGrade()).append(")");
        return sb.toString();
    }
}
