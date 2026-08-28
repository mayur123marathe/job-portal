package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationAttachmentResponse {

    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSizeBytes;
}
