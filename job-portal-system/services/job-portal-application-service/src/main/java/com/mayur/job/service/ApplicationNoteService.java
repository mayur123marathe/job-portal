package com.mayur.job.service;

import com.mayur.job.dto.response.ApplicationNoteResponse;
import com.mayur.job.dto.application.request.AddApplicationNoteRequest;

import java.util.List;

public interface ApplicationNoteService {

    ApplicationNoteResponse addNote(
            Long applicationId, Long employerId,
                                     AddApplicationNoteRequest req)
            throws Exception, Exception;

    List<ApplicationNoteResponse> getNotesByApplication(
            Long applicationId, Long employerId)
            throws Exception, Exception;

    void deleteNote(Long noteId, Long applicationId, Long employerId)
            throws Exception, Exception;
}
