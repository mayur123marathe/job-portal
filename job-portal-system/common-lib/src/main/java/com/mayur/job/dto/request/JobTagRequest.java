package com.mayur.job.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobTagRequest {

    @NotBlank(message = "Tag name is required")
    @Size(max = 60, message = "Tag name must not exceed 60 characters")
    private String name;
}
