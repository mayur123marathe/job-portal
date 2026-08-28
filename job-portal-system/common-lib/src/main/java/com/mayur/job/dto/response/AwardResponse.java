package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AwardResponse {

    private Long id;
    private String title;
    private String issuedBy;
    private LocalDate awardDate;
    private String description;
    private Integer displayOrder;
}
