package com.mayur.job.service;

import com.mayur.job.client.GeminiClient;
import com.mayur.job.dto.ai.request.BulkScreeningRequest;
import com.mayur.job.dto.ai.request.CandidateScreeningInput;
import com.mayur.job.dto.ai.request.CoverLetterRequest;
import com.mayur.job.dto.ai.request.InterviewQuestionsRequest;
import com.mayur.job.dto.ai.request.ScreeningScoreRequest;
import com.mayur.job.dto.ai.request.SkillsGapRequest;
import com.mayur.job.dto.ai.response.AiTextResponse;
import com.mayur.job.dto.ai.response.BulkScreeningResponse;
import com.mayur.job.dto.ai.response.InterviewQuestionsResponse;
import com.mayur.job.dto.ai.response.ScreeningScoreResponse;
import com.mayur.job.dto.ai.response.SkillsGapResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationAiService {

    private final GeminiClient geminiClient;

    private static final String SYSTEM = """
            You are a senior technical recruiter and career coach with 15+ years of experience in the Indian tech industry.
            You specialize in candidate evaluation, cover letter writing, skills gap analysis, and career development.
            Always provide objective, fair, and actionable assessments based only on the information provided.
            When asked for JSON, respond ONLY with valid JSON — no explanation, no markdown fences.
            """;

    // ==================== Phase 2: Cover Letter Generator ====================

    public AiTextResponse generateCoverLetter(CoverLetterRequest req) throws Exception {
        String skills = req.getCandidateSkills() != null
                ? String.join(", ", req.getCandidateSkills())
                : "Not provided";
        String experience = req.getCandidateExperience() != null
                ? String.join("; ", req.getCandidateExperience())
                : "Not provided";

        String prompt = """
                Write a compelling, personalized cover letter.

                Position: %s
                Job Description: %s
                Target Company: %s

                Candidate Profile:
                - Name: %s
                - Professional Summary: %s
                - Key Skills: %s
                - Relevant Experience: %s

                Write a 3-paragraph cover letter:
                Paragraph 1 (Opening): Express specific enthusiasm for this exact role and company. Mention 1 specific thing about the role that excites you.
                Paragraph 2 (Body): Connect 2-3 of the candidate's strongest experiences/skills directly to the job requirements. Be specific with examples.
                Paragraph 3 (Closing): Confident call to action. Express eagerness to discuss further.

                Rules:
                - Write as the candidate (first person)
                - Be specific — avoid generic statements
                - Maximum 300 words
                - Professional but warm tone
                - Do NOT use placeholders like [Company Name] — use the actual company name or say "your team"
                - Do NOT include subject line or date
                """.formatted(
                req.getJobTitle(),
                req.getJobDescription() != null ? req.getJobDescription() : "Not provided",
                req.getTargetCompanyName() != null ? req.getTargetCompanyName() : "your organization",
                req.getCandidateName(),
                req.getCandidateSummary() != null ? req.getCandidateSummary() : "Experienced professional",
                skills, experience
        );

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM, prompt))
                .build();
    }

    // ==================== Phase 3: Candidate Screening Score ====================

    public ScreeningScoreResponse scoreCandidate(ScreeningScoreRequest req) throws Exception {
        String requiredSkills = req.getRequiredSkills() != null
                ? String.join(", ", req.getRequiredSkills()) : "Not specified";
        String candidateSkills = req.getCandidateSkills() != null
                ? String.join(", ", req.getCandidateSkills()) : "Not specified";
        String candidateExp = req.getCandidateExperience() != null
                ? String.join("; ", req.getCandidateExperience()) : "Not provided";
        String candidateEdu = req.getCandidateEducation() != null && !req.getCandidateEducation().isEmpty()
                ? String.join("; ", req.getCandidateEducation()) : "Not provided";

        String prompt = """
                Score this job application based on how well the candidate matches the requirements.

                Job Requirements:
                - Title: %s
                - Experience Level Required: %s
                - Required Skills: %s
                - Key Responsibilities: %s

                Candidate Profile:
                - Professional Summary: %s
                - Skills: %s
                - Work Experience: %s
                - Education: %s

                Respond with ONLY this JSON (no explanation, no markdown):
                {
                  "score": 85,
                  "skillsMatchScore": 90,
                  "experienceMatchScore": 80,
                  "educationMatchScore": 75,
                  "matchedSkills": ["skill1", "skill2"],
                  "missingSkills": ["skill3"],
                  "strengths": ["strength1", "strength2"],
                  "concerns": ["concern1"],
                  "summary": "2-3 sentence honest assessment of this candidate's fit"
                }

                Score scale: 0-100 where 100 is a perfect match.
                skillsMatchScore: how well candidate skills match required skills (0-100).
                experienceMatchScore: how well candidate experience matches required level (0-100).
                educationMatchScore: how well candidate education fits the role — use the actual education provided, not a guess (0-100).
                score: overall weighted match considering all factors. Be objective and fair.
                """.formatted(
                req.getJobTitle() != null ? req.getJobTitle() : "Not specified",
                req.getExperienceLevel() != null ? req.getExperienceLevel() : "Not specified",
                requiredSkills,
                req.getResponsibilities() != null ? req.getResponsibilities() : "Not provided",
                req.getCandidateSummary() != null ? req.getCandidateSummary() : "Not provided",
                candidateSkills, candidateExp, candidateEdu
        );

        return geminiClient.generateJson(SYSTEM, prompt, ScreeningScoreResponse.class);
    }

    // ==================== Phase 4: Skills Gap Analysis ====================

    public SkillsGapResponse analyzeSkillsGap(SkillsGapRequest req) throws Exception {
        String candidateSkills = req.getCandidateSkills() != null
                ? String.join(", ", req.getCandidateSkills()) : "None provided";
        String requiredSkills = req.getRequiredSkills() != null
                ? String.join(", ", req.getRequiredSkills()) : "None provided";

        String prompt = """
                Analyze the skills gap between a candidate and a job requirement.

                Job Title: %s
                Candidate's Current Skills: %s
                Skills Required for the Job: %s

                {
                  "matchedSkills": ["skills candidate has that are required"],
                  "missingSkills": ["required skills candidate completely lacks"],
                  "partialMatch": ["skills candidate has partially or related version of"],
                  "prioritySkillsToLearn": ["top 3 skills to learn first, in order of importance"],
                  "learningRecommendations": [
                    { "skill": "skill name", "why": "why this skill is important for the role", "howToLearn": "specific learning resource or approach" }
                  ],
                  "overallReadiness": "Ready or Partially Ready or Needs Development",
                  "summary": "2-sentence honest assessment"
                }
                """.formatted(req.getJobTitle(), candidateSkills, requiredSkills);

        return geminiClient.generateJson(SYSTEM, prompt, SkillsGapResponse.class);
    }

    // ==================== Phase 3: Application Note Summarizer ====================

    public AiTextResponse summarizeApplicationNotes(List<String> notes) throws Exception {
        String allNotes = String.join("\n---\n", notes);
        String prompt = """
                Summarize these recruiter notes about a job candidate into a concise TL;DR.

                Recruiter Notes:
                %s

                Write a 3-5 sentence summary covering:
                1. Overall impression of the candidate
                2. Key strengths mentioned
                3. Any concerns or points to verify
                4. Recommended next step (if mentioned)

                Keep it factual, based only on what's in the notes.
                """.formatted(allNotes);

        return AiTextResponse.builder()
                .content(geminiClient.generateText(SYSTEM, prompt))
                .build();
    }
}
