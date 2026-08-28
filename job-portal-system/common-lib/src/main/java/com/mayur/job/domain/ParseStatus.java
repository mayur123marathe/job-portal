package com.mayur.job.domain;

public enum ParseStatus {
    PENDING,      // file uploaded, queued for parsing
    PROCESSING,   // parser is actively reading the file
    COMPLETED,    // parsing succeeded, structured data is available
    FAILED        // parsing could not extract usable data
}
