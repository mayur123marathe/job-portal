package com.mayur.job.dto.resume.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddAwardRequest {

    @NotBlank(message = "Award title is required")
    private String title;

    private String issuedBy;
    private LocalDate awardDate;
    private String description;
    private Integer displayOrder;
}
