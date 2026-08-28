package com.mayur.job.domain;

/**
 * AI-driven shortlist classification assigned after candidate screening.
 *
 * AUTO_SHORTLISTED    — score >= 90: move directly to shortlist, notify candidate
 * REVIEW_RECOMMENDED  — score 75–89: flag for employer review
 * PENDING_REVIEW      — score 50–74: normal review queue
 * LOW_MATCH           — score < 50:  deprioritised (still visible, not hidden)
 * NOT_SCREENED        — default before AI scoring completes
 */
public enum AiShortlistStatus {
    NOT_SCREENED,
    AUTO_SHORTLISTED,
    REVIEW_RECOMMENDED,
    PENDING_REVIEW,
    LOW_MATCH
}
