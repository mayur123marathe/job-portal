package com.mayur.job.dto.ai.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class InterviewQuestionsResponse {

    private List<Question> questions;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Question {
        private String question;
        private String category;
        private String difficulty;
    }
}
