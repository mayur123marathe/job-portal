package com.mayur.job.event;

import com.mayur.job.client.CompanyClient;
import com.mayur.job.client.JobClient;
import com.mayur.job.client.UserClient;
import com.mayur.job.domain.ApplicationStatus;
import com.mayur.job.dto.response.CompanyResponse;
import com.mayur.job.dto.response.JobResponse;
import com.mayur.job.dto.response.JobSummaryResponse;
import com.mayur.job.dto.response.UserResponse;
import com.mayur.job.event.ApplicationNoteAddedEvent;
import com.mayur.job.event.ApplicationStatusChangedEvent;
import com.mayur.job.entity.Application;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationEventPublisher {

    public static final String TOPIC_STATUS_CHANGED = "application.status.changed";
    public static final String TOPIC_NOTE_ADDED = "application.note.added";

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final UserClient userClient;
    private final JobClient jobClient;
    private final CompanyClient companyClient;

    public void publishStatusChanged(Application app,
                                     ApplicationStatus oldStatus,
                                     String note) {
        try {
            UserResponse candidate = userClient.getUserById(app.getCandidateId());
            JobResponse job = jobClient.getJobSummaryById(app.getJobId());
            CompanyResponse company = companyClient.getCompanySummaryById(
                    app.getCompanyId());

            ApplicationStatusChangedEvent event = ApplicationStatusChangedEvent.builder()
                    .applicationId(app.getId())
                    .candidateId(app.getCandidateId())
                    .candidateEmail(candidate.getEmail())
                    .candidateName(candidate.getFullName())
                    .oldStatus(oldStatus)
                    .newStatus(app.getStatus())
                    .note(note)
                    .jobTitle(job.getTitle())
                    .companyName(company.getName())
                    .changedAt(LocalDateTime.now())
                    .build();

            kafkaTemplate.send(TOPIC_STATUS_CHANGED,
                    String.valueOf(app.getId()), event);
            log.info("Published status-changed event for application {}", app.getId());
        } catch (Exception e) {
            log.error("Failed to publish status-changed event for application {}", app.getId(), e);
        }
    }

    public void publishNoteAdded(Application app) {
        try {
            UserResponse candidate = userClient.getUserById(app.getCandidateId());
            JobResponse job = jobClient.getJobSummaryById(app.getJobId());
            CompanyResponse company = companyClient.getCompanySummaryById(app.getCompanyId());

            ApplicationNoteAddedEvent event = ApplicationNoteAddedEvent.builder()
                    .applicationId(app.getId())
                    .candidateId(app.getCandidateId())
                    .candidateEmail(candidate.getEmail())
                    .candidateName(candidate.getFullName())
                    .jobTitle(job.getTitle())
                    .companyName(company.getName())
                    .addedAt(LocalDateTime.now())
                    .build();

            kafkaTemplate.send(TOPIC_NOTE_ADDED, String.valueOf(app.getId()), event);
            log.info("Published note-added event for application {}", app.getId());
        } catch (Exception e) {
            log.error("Failed to publish note-added event for application {}", app.getId(), e);
        }
    }
}