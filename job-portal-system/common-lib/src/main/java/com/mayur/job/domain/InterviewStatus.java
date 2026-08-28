package com.mayur.job.domain;

public enum InterviewStatus {
    SCHEDULED,    // confirmed and upcoming
    COMPLETED,    // interview took place
    CANCELLED,    // cancelled by employer or candidate
    RESCHEDULED,  // moved to a new time (old record cancelled, new one created)
    NO_SHOW       // candidate did not attend
}
