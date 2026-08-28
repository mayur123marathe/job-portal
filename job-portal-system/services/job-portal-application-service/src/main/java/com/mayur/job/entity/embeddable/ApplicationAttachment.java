package com.mayur.job.entity.embeddable;

import jakarta.persistence.Embeddable;
import lombok.*;

/**
 * A single file attached to an application (portfolio, certificate, writing sample, etc.).
 * Stored as @ElementCollection inside Application — no independent lifecycle needed.
 * Resume has its own dedicated fields on Application; this is for additional documents.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationAttachment {

    /** Public URL to the uploaded file (S3, GCS, etc.). */
    private String fileUrl;

    private String fileName;

    /** e.g. "PDF", "DOC", "PNG". */
    private String fileType;

    /** File size in bytes — shown to employer before downloading. */
    private Long fileSizeBytes;
}
