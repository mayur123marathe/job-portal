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
public class UpdateResumeRequest {

    @NotBlank(message = "Resume title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    private ResumeTemplate template;

    private ResumeVisibility visibility;
}
