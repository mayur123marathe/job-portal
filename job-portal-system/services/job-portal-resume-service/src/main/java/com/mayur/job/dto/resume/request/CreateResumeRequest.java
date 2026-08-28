package com.mayur.job.dto.resume.request;

import com.mayur.job.domain.ResumeTemplate;
import com.mayur.job.domain.ResumeVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateResumeRequest {

    @NotBlank(message = "Resume title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    @Builder.Default
    private ResumeTemplate template = ResumeTemplate.PROFESSIONAL;

    @Builder.Default
    private ResumeVisibility visibility = ResumeVisibility.PRIVATE;

    private Boolean isDefault = false;
}
