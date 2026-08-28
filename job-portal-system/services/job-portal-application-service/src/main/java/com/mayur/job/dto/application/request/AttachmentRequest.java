package com.mayur.job.dto.application.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttachmentRequest {

    private String fileUrl;

    private String fileName;

    private String fileType;

    private Long fileSizeBytes;
}
