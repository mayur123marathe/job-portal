package com.mayur.job.mapper;

import com.mayur.job.dto.response.*;
import com.mayur.job.dto.application.request.AttachmentRequest;
import com.mayur.job.dto.application.request.CreateApplicationRequest;
import com.mayur.job.entity.Application;
import com.mayur.job.entity.ApplicationNote;
import com.mayur.job.entity.ApplicationScreening;
import com.mayur.job.entity.ApplicationStatusHistory;
import com.mayur.job.entity.embeddable.ApplicationAttachment;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ApplicationMapper {

    private ApplicationMapper() {}

    // ── toEntity ──────────────────────────────────────────────────────────────

    public static Application toEntity(CreateApplicationRequest req,
                                       Long candidateId,
                                       Long companyId,
                                       Long employerId) {


        return Application.builder()
                .candidateId(candidateId)
                .jobId(req.getJobId())
                .companyId(companyId)
                .employerId(employerId)
                .resumeId(req.getResumeId())
                .coverLetter(req.getCoverLetter())
                .expectedSalary(req.getExpectedSalary())
                .availableFrom(req.getAvailableFrom())
                .build();
    }

    private static ApplicationAttachment toAttachmentEntity(AttachmentRequest r) {
        return ApplicationAttachment.builder()
                .fileUrl(r.getFileUrl())
                .fileName(r.getFileName())
                .fileType(r.getFileType())
                .fileSizeBytes(r.getFileSizeBytes())
                .build();
    }

    // ── Attachment ────────────────────────────────────────────────────────────

    public static ApplicationAttachmentResponse toAttachmentResponse(ApplicationAttachment a) {
        return ApplicationAttachmentResponse.builder()
                .fileUrl(a.getFileUrl())
                .fileName(a.getFileName())
                .fileType(a.getFileType())
                .fileSizeBytes(a.getFileSizeBytes())
                .build();
    }

    // ── Status History ────────────────────────────────────────────────────────

    public static ApplicationStatusHistoryResponse toHistoryResponse(ApplicationStatusHistory h) {
        return ApplicationStatusHistoryResponse.builder()
                .id(h.getId())
                .fromStatus(h.getFromStatus())
                .toStatus(h.getToStatus())
                .changedByUserId(h.getChangedByUserId())
                .note(h.getNote())
                .changedAt(h.getChangedAt())
                .build();
    }

    public static List<ApplicationStatusHistoryResponse> toHistoryResponseList(
            List<ApplicationStatusHistory> history) {
        if (history == null) return Collections.emptyList();
        return history.stream().map(ApplicationMapper::toHistoryResponse).collect(Collectors.toList());
    }

    // ── Interview ─────────────────────────────────────────────────────────────




    // ── Note ──────────────────────────────────────────────────────────────────

    public static ApplicationNoteResponse toNoteResponse(ApplicationNote note) {
        return ApplicationNoteResponse.builder()
                .id(note.getId())
                .addedByUserId(note.getAddedByUserId())
                .content(note.getContent())
                .createdAt(note.getCreatedAt())
                .build();
    }

    public static List<ApplicationNoteResponse> toNoteResponseList(List<ApplicationNote> notes) {
        if (notes == null) return Collections.emptyList();
        return notes.stream().map(ApplicationMapper::toNoteResponse).collect(Collectors.toList());
    }

    // ── Screening ─────────────────────────────────────────────────────────────

    public static ApplicationScreeningResponse toScreeningResponse(ApplicationScreening s) {
        if (s == null) return null;
        return ApplicationScreeningResponse.builder()
                .id(s.getId())
                .overallScore(s.getOverallScore())
                .skillsMatchScore(s.getSkillsMatchScore())
                .experienceMatchScore(s.getExperienceMatchScore())
                .educationMatchScore(s.getEducationMatchScore())
                .shortlistStatus(s.getShortlistStatus())
                .summary(s.getSummary())
                .matchedSkills(s.getMatchedSkills())
                .missingSkills(s.getMissingSkills())
                .strengths(s.getStrengths())
                .concerns(s.getConcerns())
                .isStale(s.getIsStale())
                .screenedAt(s.getScreenedAt())
                .screeningVersion(s.getScreeningVersion())
                .build();
    }

    // ── Application ───────────────────────────────────────────────────────────

    public static ApplicationResponse toResponse(Application application,
                                                   List<ApplicationStatusHistory> history,

                                                   List<ApplicationNote> notes,
                                                   JobResponse job,
                                                   CompanyResponse company,
                                                   UserResponse candidate,
                                                   ApplicationScreening screening) {

        return ApplicationResponse.builder()
                .id(application.getId())
                .candidate(candidate)
                .employerId(application.getEmployerId())
                .job(job)
                .company(company)
                .status(application.getStatus())

                .resumeId(application.getResumeId())
                .coverLetter(application.getCoverLetter())

                .expectedSalary(application.getExpectedSalary())

                .availableFrom(application.getAvailableFrom())
                .isRead(application.getIsRead())
                .isStarred(application.getIsStarred())
                .statusHistory(toHistoryResponseList(history))

                .notes(toNoteResponseList(notes))
                .withdrawnAt(application.getWithdrawnAt())
                .withdrawnReason(application.getWithdrawnReason())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .screening(toScreeningResponse(screening))
                .build();
    }

    public static ApplicationSummaryResponse toSummaryResponse(Application application) {
        return ApplicationSummaryResponse.builder()
                .id(application.getId())
                .candidateId(application.getCandidateId())
                .jobId(application.getJobId())
                .companyId(application.getCompanyId())
                .status(application.getStatus())

                .isRead(application.getIsRead())
                .isStarred(application.getIsStarred())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .aiScore(application.getAiScore())
                .aiShortlistStatus(application.getAiShortlistStatus())
                .build();
    }

    public static List<ApplicationSummaryResponse> toSummaryResponseList(List<Application> applications) {
        if (applications == null) return Collections.emptyList();
        return applications.stream()
                .map(ApplicationMapper::toSummaryResponse)
                .collect(Collectors.toList());
    }
}
