package com.mayur.job.service.impl;

import com.mayur.job.client.CompanyClient;
import com.mayur.job.client.JobClient;
import com.mayur.job.client.ResumeClient;
import com.mayur.job.client.UserClient;
import com.mayur.job.domain.ApplicationStatus;
import com.mayur.job.dto.response.*;
import com.mayur.job.dto.application.request.CompanyApplicationFilterRequest;
import com.mayur.job.dto.application.request.CreateApplicationRequest;
import com.mayur.job.dto.application.request.UpdateApplicationStatusRequest;
import com.mayur.job.dto.application.request.WithdrawApplicationRequest;
import com.mayur.job.entity.Application;
import com.mayur.job.entity.ApplicationNote;
import com.mayur.job.entity.ApplicationScreening;
import com.mayur.job.entity.ApplicationStatusHistory;
import com.mayur.job.event.ApplicationEventPublisher;
import com.mayur.job.mapper.ApplicationMapper;
import com.mayur.job.event.ApplicationEventPublisher;
import com.mayur.job.service.ApplicationScreeningService;
import com.mayur.job.repository.ApplicationNoteRepository;
import com.mayur.job.repository.ApplicationRepository;
import com.mayur.job.repository.ApplicationScreeningRepository;
import com.mayur.job.repository.ApplicationSpecification;
import com.mayur.job.repository.ApplicationStatusHistoryRepository;
import com.mayur.job.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationScreeningRepository screeningRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final ApplicationNoteRepository noteRepository;
    private final JobClient jobClient;
    private final ResumeClient resumeClient;
    private final CompanyClient companyClient;
    private final UserClient userClient;
    private final ApplicationScreeningService screeningService;
    private final ApplicationEventPublisher eventPublisher;

    // ── Create ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ApplicationResponse createApplication(Long candidateId,
                                                 CreateApplicationRequest req)
            throws Exception {
        if (applicationRepository.existsByCandidateIdAndJobId(candidateId, req.getJobId())) {
            throw new Exception("You have already applied for this job");
        }

        //todos

        JobResponse job = jobClient.getJobById(req.getJobId());
        Long companyId=job.getCompany().getId();
        Long employerId=job.getEmployerId();
        ResumeResponse resume = resumeClient.getResumeById(req.getResumeId(), candidateId);
        if (!resume.getCandidateId().equals(candidateId)) {
            throw new Exception("Resume does not belong to you");
        }

//        Application application = ApplicationMapper.toEntity(req, candidateId,
//                job.getCompany().getId(), job.getEmployerId());
        Application application = ApplicationMapper.toEntity(req, candidateId,
                companyId, employerId);

        application = applicationRepository.save(application);

        ApplicationStatusHistory initialHistory = ApplicationStatusHistory.builder()
                .application(application)
                .fromStatus(null)
                .toStatus(ApplicationStatus.PENDING)
                .changedByUserId(candidateId)
                .note("Application submitted")
                .build();
        historyRepository.save(initialHistory);

//todo
        // Fire-and-forget — AI screening runs in a background thread, no callback needed

        screeningService.screenAsync(application.getId(), candidateId, req.getJobId(), req.getResumeId());

        return buildFullResponse(application);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) throws Exception {
        Application application = getApplicationEntity(id);
        return buildFullResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId).stream()
                .map(this::buildFullResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::buildFullResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForCompany(
            Long userId,
            CompanyApplicationFilterRequest filter
    ) throws Exception {
        Long companyId = companyClient.getMyCompany(userId).getId();
//        Long companyId = 1L;

        LocalDateTime from = filter.getAppliedFrom() != null
                ? filter.getAppliedFrom().atStartOfDay() : null;
        LocalDateTime to = filter.getAppliedTo() != null
                ? filter.getAppliedTo().atTime(LocalTime.MAX) : null;

        Sort sort = buildSort(filter.getSortBy());

        return applicationRepository.findAll(
                ApplicationSpecification.forCompanyWithFilters(
                        companyId,
                        filter.getJobId(),
                        filter.getStatus(),
                        filter.getSource(),
                        filter.getIsRead(),
                        filter.getIsStarred(),
                        from,
                        to,
                        filter.getAiShortlistStatus(),
                        filter.getMinAiScore()
                ), sort).stream()
                .map(this::buildFullResponse)
                .collect(Collectors.toList());
    }

    // ── Status update ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, Long employerId,
                                             UpdateApplicationStatusRequest req)
            throws Exception, Exception {
        Application application = getApplicationEntity(applicationId);
        assertEmployer(application, employerId);

        if (application.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new Exception("Cannot update status of a withdrawn application");
        }
        if (application.getStatus() == req.getStatus()) {
            throw new Exception("Application is already in status: " + req.getStatus());
        }

        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(req.getStatus());
        application = applicationRepository.save(application);

        historyRepository.save(ApplicationStatusHistory.builder()
                .application(application)
                .fromStatus(oldStatus)
                .toStatus(req.getStatus())
                .changedByUserId(employerId)
                .note(req.getNote())
                .build());

        eventPublisher.publishStatusChanged(application, oldStatus, req.getNote());

        return buildFullResponse(application);
    }

    // ── Withdraw ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ApplicationResponse withdraw(Long applicationId, Long candidateId,
                                         WithdrawApplicationRequest req)
            throws Exception, Exception {
        Application application = getApplicationEntity(applicationId);
        assertCandidate(application, candidateId);

        if (application.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new Exception("Application is already withdrawn");
        }
        if (application.getStatus() == ApplicationStatus.HIRED) {
            throw new Exception("Cannot withdraw an accepted offer");
        }

        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(ApplicationStatus.WITHDRAWN);
        application.setWithdrawnAt(LocalDateTime.now());
        application.setWithdrawnReason(req.getReason());
        application = applicationRepository.save(application);

        historyRepository.save(ApplicationStatusHistory.builder()
                .application(application)
                .fromStatus(oldStatus)
                .toStatus(ApplicationStatus.WITHDRAWN)
                .changedByUserId(candidateId)
                .note(req.getReason())
                .build());

        return buildFullResponse(application);
    }

    // ── Tracking flags ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ApplicationResponse markAsRead(Long applicationId, Long employerId)
            throws Exception, Exception {
        Application application = getApplicationEntity(applicationId);
        assertEmployer(application, employerId);
        application.setIsRead(true);
        return buildFullResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional
    public ApplicationResponse toggleStar(Long applicationId, Long employerId)
            throws Exception, Exception {
        Application application = getApplicationEntity(applicationId);
        assertEmployer(application, employerId);
        application.setIsStarred(!application.getIsStarred());
        return buildFullResponse(applicationRepository.save(application));
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void deleteApplication(Long applicationId, Long candidateId)
            throws Exception, Exception {
        Application application = getApplicationEntity(applicationId);
        assertCandidate(application, candidateId);
        applicationRepository.delete(application);
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Application getApplicationEntity(Long id) throws Exception {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new Exception(
                        "Application not found with id: " + id));
    }

    @Override
    @Transactional
    public void markScreeningsStaleForJob(Long jobId) {
        List<Long> applicationIds = applicationRepository.findByJobId(jobId)
                .stream().map(Application::getId).collect(Collectors.toList());
        if (applicationIds.isEmpty()) return;
        List<ApplicationScreening> screenings = screeningRepository.findByApplicationIdIn(applicationIds);
        screenings.forEach(s -> s.setIsStale(true));
        screeningRepository.saveAll(screenings);
    }

    // ── Private utilities ─────────────────────────────────────────────────────

    private void assertEmployer(Application application, Long employerId) throws Exception {
        if (!application.getEmployerId().equals(employerId)) {
            throw new Exception("You are not the employer for this application");
        }
    }

    private void assertCandidate(Application application, Long candidateId) throws Exception {
        if (!application.getCandidateId().equals(candidateId)) {
            throw new Exception("You are not the owner of this application");
        }
    }

    private Sort buildSort(String sortBy) {
        if ("AI_SCORE_DESC".equals(sortBy)) {
            return Sort.by(Sort.Order.desc("aiScore").with(Sort.NullHandling.NULLS_LAST));
        } else if ("AI_SCORE_ASC".equals(sortBy)) {
            return Sort.by(Sort.Order.asc("aiScore").with(Sort.NullHandling.NULLS_LAST));
        }
        return Sort.by(Sort.Direction.DESC, "appliedAt");
    }

    private ApplicationResponse buildFullResponse(Application application) {
        List<ApplicationStatusHistory> history =
                historyRepository.findByApplicationIdOrderByChangedAtAsc(application.getId());

        List<ApplicationNote> notes =
                noteRepository.findByApplicationIdOrderByCreatedAtDesc(application.getId());
        JobResponse job = jobClient.getJobSummaryById(application.getJobId());
        CompanyResponse company = companyClient.getCompanySummaryById(application.getCompanyId());
        UserResponse candidate = userClient.getUserById(application.getCandidateId());

//        JobResponse job = JobResponse.builder().id(application.getId()).build();
//        CompanyResponse company = CompanyResponse.builder().id(application.getCompanyId()).build();
//        UserResponse candidate = UserResponse.builder().id(application.getCandidateId()).build();


        ApplicationScreening screening = screeningRepository.findByApplicationId(application.getId()).orElse(null);

        return ApplicationMapper.toResponse(application, history, notes, job, company, candidate, screening);
    }
}
