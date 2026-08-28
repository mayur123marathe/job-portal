package com.mayur.job.domain;

public enum AlertFrequency {

    /** Notify as soon as a matching job is posted. */
    IMMEDIATELY,

    /** Batch matching jobs and send one digest per day. */
    DAILY,

    /** Batch matching jobs and send one digest per week. */
    WEEKLY
}
