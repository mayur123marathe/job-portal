package com.mayur.job.service.impl;

import com.mayur.job.dto.response.ApplicationNoteResponse;

import com.mayur.job.dto.application.request.AddApplicationNoteRequest;
import com.mayur.job.entity.Application;
import com.mayur.job.entity.ApplicationNote;
//import com.mayur.job.event.ApplicationEventPublisher;
import com.mayur.job.mapper.ApplicationMapper;
import com.mayur.job.repository.ApplicationNoteRepository;
import com.mayur.job.service.ApplicationNoteService;
import com.mayur.job.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationNoteServiceImpl implements ApplicationNoteService {

    private final ApplicationNoteRepository noteRepository;
    private final ApplicationService applicationService;
//    private final ApplicationEventPublisher eventPublisher;

    // ── Add ───────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ApplicationNoteResponse addNote(Long applicationId, Long employerId,
                                            AddApplicationNoteRequest req)
            throws Exception {
        Application application = applicationService
                .getApplicationEntity(applicationId);

        assertEmployer(application, employerId);

        ApplicationNote note = ApplicationNote.builder()
                .application(application)
                .addedByUserId(employerId)
                .content(req.getContent())
                .build();

        ApplicationNoteResponse response = ApplicationMapper.toNoteResponse(noteRepository.save(note));
//        eventPublisher.publishNoteAdded(application);
        return response;
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationNoteResponse> getNotesByApplication(Long applicationId, Long employerId)
            throws Exception {
        Application application = applicationService.getApplicationEntity(applicationId);
        assertEmployer(application, employerId);

        return noteRepository.findByApplicationIdOrderByCreatedAtDesc(applicationId)
                .stream()
                .map(ApplicationMapper::toNoteResponse)
                .collect(Collectors.toList());
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void deleteNote(Long noteId, Long applicationId, Long employerId)
            throws  Exception {
        Application application = applicationService.getApplicationEntity(applicationId);
        assertEmployer(application, employerId);

        ApplicationNote note = noteRepository.findById(noteId)
                .orElseThrow(() -> new Exception(
                        "Note not found with id: " + noteId));

        if (!note.getApplication().getId().equals(applicationId)) {
            throw new Exception(
                    "Note does not belong to application with id: " + applicationId);
        }

        noteRepository.delete(note);
    }

    // ── Private utilities ─────────────────────────────────────────────────────

    private void assertEmployer(Application application, Long employerId) throws Exception {
        if (!application.getEmployerId().equals(employerId)) {
            throw new Exception("You are not the employer for this application");
        }
    }
}
