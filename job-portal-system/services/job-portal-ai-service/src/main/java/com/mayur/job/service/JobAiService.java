package com.mayur.job.service;

import com.mayur.job.client.GeminiClient;
import com.mayur.job.dto.ai.request.HiringInsightsRequest;
import com.mayur.job.dto.ai.request.JobDescriptionRequest;
import com.mayur.job.dto.ai.request.SalaryRangeRequest;
import com.mayur.job.dto.ai.response.AiTextResponse;
import com.mayur.job.dto.ai.response.HiringInsightsResponse;
import com.mayur.job.dto.ai.response.SalaryRangeResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobAiService {

    private final GeminiClient geminiClient;

    private static final String SYSTEM = """
            You are a senior HR professional and technical recruiter with deep knowledge of the Indian job market (2025-2026).
            You specialize in writing job descriptions, compensation benchmarking, and talent acquisition.
            Always write in a professional, engaging, inclusive, and bias-free tone.
            When asked for JSON, respond ONLY with valid JSON — no explanation, no markdown fences.
            """;

    // ==================== Phase 1: Job Description Generator ====================

    public AiTextResponse generateJobDescription(JobDescriptionRequest req) throws Exception {
        String skills = req.getSkills() != null ? String.join(", ", req.getSkills()) : "Not specified";
        String prompt = """
                Write a comprehensive, engaging, and inclusive job description.

                Job Details:
                - Title: %s
                - Required Skills: %s
                - Experience Level: %s
                - Job Type: %s
                - Work Mode: %s
                - Category: %s
                - Additional Context: %s

                Format the response in clean markdown with EXACTLY these sections:
                ## About the Role
                [2-3 compelling sentences describing the role and its impact]

                ## Key Responsibilities
                - [6 specific, action-oriented bullet points]

                ## Requirements
                - [5-6 must-have qualifications and skills]

                ## Nice to Have
                - [3-4 bonus qualifications]

                ## What We Offer
                - [4-5 benefits and perks]

                Do NOT include placeholder company names.
                """.formatted(
                req.getTitle(), skills,
                req.getExperienceLevel() != null ? req.getExperienceLevel() : "Not specified",
                req.getJobType() != null ? req.getJobType() : "Not specified",
                req.getWorkMode() != null ? req.getWorkMode() : "Not specified",
                req.getCategory() != null ? req.getCategory() : "Not specified",
                req.getAdditionalContext() != null ? req.getAdditionalContext() : "None"
        );

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM, prompt))
                .build();
    }

    // ==================== Phase 1: Job Requirements Auto-fill ====================

    public AiTextResponse generateJobRequirements(String title, String category) throws Exception {
        String prompt = """
                Generate professional job requirements and responsibilities for this role.

                Job Title: %s
                Category: %s

                Format in markdown:
                ## Responsibilities
                - [5 specific bullet points]

                ## Requirements
                - [5 specific bullet points]

                Keep it concise and ATS-friendly.
                """.formatted(title, category != null ? category : "General");

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM, prompt))
                .build();
    }

    // ==================== Phase 1: Salary Range Suggestion ====================

    public SalaryRangeResponse suggestSalaryRange(SalaryRangeRequest req) throws Exception {
        String skills = req.getSkills() != null ? String.join(", ", req.getSkills()) : "Not specified";
        String prompt = """
                Provide a realistic and competitive salary range for this role.

                Role Details:
                - Job Title: %s
                - Required Skills: %s
                - Experience Level: %s
                - Job Type: %s
                - Location: %s

                {
                  "minSalary": 600000,
                  "maxSalary": 1200000,
                  "currency": "INR",
                  "period": "YEARLY",
                  "marketInsight": "Brief 1-2 sentence insight about this role's compensation trend in the current Indian market"
                }

                minSalary and maxSalary must be numbers (not strings). Use realistic current Indian market rates.
                """.formatted(
                req.getTitle(), skills,
                req.getExperienceLevel() != null ? req.getExperienceLevel() : "MID",
                req.getJobType() != null ? req.getJobType() : "FULL_TIME",
                req.getLocation() != null ? req.getLocation() : "India"
        );

        return geminiClient.generateJson(SYSTEM, prompt, SalaryRangeResponse.class);
    }

    // ==================== Responsibilities Auto-fill ====================

    public AiTextResponse generateJobResponsibilities(String title, String category) throws Exception {
        String prompt = """
                Generate 6 specific, action-oriented job responsibilities for this role.

                Job Title: %s
                Category: %s

                Return ONLY a plain bullet list (no headings, no markdown headers):
                - [responsibility 1]
                - [responsibility 2]
                ...

                Keep each bullet concise (under 15 words), start with a strong action verb.
                """.formatted(title, category != null ? category : "General");

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM, prompt))
                .build();
    }

    // ==================== Benefits Auto-fill ====================

    public AiTextResponse generateJobBenefits(String title, String category, String jobType) throws Exception {
        String prompt = """
                Generate 6 competitive, attractive job benefits for this role.

                Job Title: %s
                Category: %s
                Job Type: %s

                Return ONLY a plain bullet list (no headings, no markdown headers):
                - [benefit 1]
                - [benefit 2]
                ...

                Include a mix of: compensation perks, health/wellness, growth, flexibility, and culture benefits.
                Keep each bullet concise and specific.
                """.formatted(title, category != null ? category : "General", jobType != null ? jobType : "Full-time");

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM, prompt))
                .build();
    }

    // ==================== Phase 3: Skills Recommendation for Job ====================

    public AiTextResponse recommendSkillsForJob(String jobTitle, String description) throws Exception {
        String prompt = """
                Recommend the most relevant skills for this job posting.

                Job Title: %s
                Description: %s

                List 8-10 specific, relevant skills that candidates should have.
                Return a comma-separated list of skill names only.
                Example: Java, Spring Boot, PostgreSQL, Docker, REST APIs, Microservices
                """.formatted(jobTitle, description != null ? description : "");

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM, prompt))
                .build();
    }

    // ==================== Tags Recommendation for Job ====================

    public AiTextResponse recommendTagsForJob(String title, String description) throws Exception {
        String prompt = """
                Recommend 8-10 relevant tags/keywords for this job posting that improve discoverability.

                Job Title: %s
                Description: %s

                Return ONLY a comma-separated list of short tag names (1-3 words each).
                Example: React, Frontend, JavaScript, Remote, Startup, Full Stack, Web Development
                """.formatted(title, description != null ? description : "");

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM, prompt))
                .build();
    }
}
