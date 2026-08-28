package com.mayur.job.dto.resume.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParseResumeRequest {

    /** Pre-signed URL of the uploaded file (PDF / DOC / DOCX). */
    @NotBlank(message = "File URL is required")
    private String fileUrl;

    @NotBlank(message = "File name is required")
    private String fileName;

    /** "PDF", "DOC", "DOCX". */
    @NotBlank(message = "File type is required")
    private String fileType;
}
