package com.mayur.job.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mayur.job.domain.SkillCategory;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobSkillResponse {

    private Long id;
    private String name;
    private String slug;
    private SkillCategory category;
    private Boolean active;
}
