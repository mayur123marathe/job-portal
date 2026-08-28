import { createSlice } from "@reduxjs/toolkit";
import {
  generateCoverLetter,
  scoreCandidate,
  generateInterviewQuestions,
  analyzeSkillsGap,
  summarizeNotes,
  generateResumeSummary,
  generateExperienceBullets,
  parseResumeText,
  getResumeImprovements,
  getCareerFeedback,
  generateJobDescription,
  generateJobRequirements,
  suggestSalary,
  recommendJobSkills,
  generateJobResponsibilities,
  generateJobBenefits,
  recommendJobTags,
  enhanceSearch,
} from "./aiThunk";

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    coverLetter: null,
    screeningScore: null,
    interviewQuestions: null,
    skillsGap: null,
    notesSummary: null,
    resumeSummary: null,
    experienceBullets: null,
    resumeParseResult: null,
    resumeImprovements: null,

    jobDescription: null,
    jobRequirements: null,
    salarySuggestion: null,
    recommendedSkills: null,
    jobResponsibilities: null,
    jobBenefits: null,
    recommendedTags: null,

    careerFeedback: null,
    searchEnhancement: null,

    isGeneratingCoverLetter: false,
    isScoringCandidate: false,
    isGeneratingQuestions: false,
    isAnalyzingSkillsGap: false,
    isSummarizingNotes: false,
    isGeneratingResumeSummary: false,
    isGeneratingBullets: false,
    isParsingResume: false,
    isGettingImprovements: false,
    isGettingCareerFeedback: false,
    isEnhancingSearch: false,

    isGeneratingJobDescription: false,
    isGeneratingJobRequirements: false,
    isSuggestingSalary: false,
    isRecommendingSkills: false,
    isGeneratingJobResponsibilities: false,
    isGeneratingJobBenefits: false,
    isRecommendingTags: false,

    // ── AI Screening Dashboard ───────────────────────────────────────────────
    // bulkScreeningResult → BulkScreeningResponse { results[], averageScore, recommendedForInterview[] }
    // hiringInsights      → HiringInsightsResponse { overallAssessment, bottlenecks[], suggestions[],
    //                         idealCandidateProfile, screeningCriteria[], keyRedFlags[], marketDemandNote }
    bulkScreeningResult: null,
    hiringInsights: null,
    isBulkScreening: false,
    isGettingHiringInsights: false,

    error: null,
  },

  reducers: {
    clearScreeningScore: (s) => {
      s.screeningScore = null;
    },
    clearSkillsGap: (s) => {
      s.skillsGap = null;
    },
    clearInterviewQuestions: (s) => {
      s.interviewQuestions = null;
    },
    clearNotesSummary: (s) => {
      s.notesSummary = null;
    },
    clearResumeSummary: (s) => {
      s.resumeSummary = null;
    },
    clearExperienceBullets: (s) => {
      s.experienceBullets = null;
    },
    clearResumeParseResult: (s) => {
      s.resumeParseResult = null;
    },
    clearResumeImprovements: (s) => {
      s.resumeImprovements = null;
    },
    clearCareerFeedback: (s) => {
      s.careerFeedback = null;
    },
    clearAiError: (s) => {
      s.error = null;
    },
    clearJobDescription: (s) => {
      s.jobDescription = null;
    },
    clearJobRequirements: (s) => {
      s.jobRequirements = null;
    },
    clearSalarySuggestion: (s) => {
      s.salarySuggestion = null;
    },
    clearRecommendedSkills: (s) => {
      s.recommendedSkills = null;
    },
    clearJobResponsibilities: (s) => {
      s.jobResponsibilities = null;
    },
    clearJobBenefits: (s) => {
      s.jobBenefits = null;
    },
    clearRecommendedTags: (s) => {
      s.recommendedTags = null;
    },
    clearBulkScreening: (s) => {
      s.bulkScreeningResult = null;
    },
    clearHiringInsights: (s) => {
      s.hiringInsights = null;
    },
    clearSearchEnhancement: (s) => {
      s.searchEnhancement = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ── generateCoverLetter ────────────────────────────────────────────────
      .addCase(generateCoverLetter.pending, (s) => {
        s.isGeneratingCoverLetter = true;
        s.error = null;
      })
      .addCase(generateCoverLetter.fulfilled, (s, { payload }) => {
        s.isGeneratingCoverLetter = false;
        s.coverLetter = payload;
      })
      .addCase(generateCoverLetter.rejected, (s, { payload }) => {
        s.isGeneratingCoverLetter = false;
        s.error = payload;
      })

      // ── scoreCandidate ─────────────────────────────────────────────────────
      .addCase(scoreCandidate.pending, (s) => {
        s.isScoringCandidate = true;
        s.error = null;
      })
      .addCase(scoreCandidate.fulfilled, (s, { payload }) => {
        s.isScoringCandidate = false;
        s.screeningScore = payload;
      })
      .addCase(scoreCandidate.rejected, (s, { payload }) => {
        s.isScoringCandidate = false;
        s.error = payload;
      })

      // ── generateInterviewQuestions ─────────────────────────────────────────
      .addCase(generateInterviewQuestions.pending, (s) => {
        s.isGeneratingQuestions = true;
        s.error = null;
      })
      .addCase(generateInterviewQuestions.fulfilled, (s, { payload }) => {
        s.isGeneratingQuestions = false;
        s.interviewQuestions = payload;
      })
      .addCase(generateInterviewQuestions.rejected, (s, { payload }) => {
        s.isGeneratingQuestions = false;
        s.error = payload;
      })

      // ── analyzeSkillsGap ───────────────────────────────────────────────────
      .addCase(analyzeSkillsGap.pending, (s) => {
        s.isAnalyzingSkillsGap = true;
        s.error = null;
      })
      .addCase(analyzeSkillsGap.fulfilled, (s, { payload }) => {
        s.isAnalyzingSkillsGap = false;
        s.skillsGap = payload;
      })
      .addCase(analyzeSkillsGap.rejected, (s, { payload }) => {
        s.isAnalyzingSkillsGap = false;
        s.error = payload;
      })

      // ── summarizeNotes ─────────────────────────────────────────────────────
      .addCase(summarizeNotes.pending, (s) => {
        s.isSummarizingNotes = true;
        s.error = null;
      })
      .addCase(summarizeNotes.fulfilled, (s, { payload }) => {
        s.isSummarizingNotes = false;
        s.notesSummary = payload;
      })
      .addCase(summarizeNotes.rejected, (s, { payload }) => {
        s.isSummarizingNotes = false;
        s.error = payload;
      })

      // ── generateResumeSummary ──────────────────────────────────────────────
      .addCase(generateResumeSummary.pending, (s) => {
        s.isGeneratingResumeSummary = true;
        s.error = null;
      })
      .addCase(generateResumeSummary.fulfilled, (s, { payload }) => {
        s.isGeneratingResumeSummary = false;
        s.resumeSummary = payload;
      })
      .addCase(generateResumeSummary.rejected, (s, { payload }) => {
        s.isGeneratingResumeSummary = false;
        s.error = payload;
      })

      // ── generateExperienceBullets ──────────────────────────────────────────
      .addCase(generateExperienceBullets.pending, (s) => {
        s.isGeneratingBullets = true;
        s.error = null;
      })
      .addCase(generateExperienceBullets.fulfilled, (s, { payload }) => {
        s.isGeneratingBullets = false;
        s.experienceBullets = payload;
      })
      .addCase(generateExperienceBullets.rejected, (s, { payload }) => {
        s.isGeneratingBullets = false;
        s.error = payload;
      })

      // ── parseResumeText ────────────────────────────────────────────────────
      .addCase(parseResumeText.pending, (s) => {
        s.isParsingResume = true;
        s.error = null;
      })
      .addCase(parseResumeText.fulfilled, (s, { payload }) => {
        s.isParsingResume = false;
        s.resumeParseResult = payload;
      })
      .addCase(parseResumeText.rejected, (s, { payload }) => {
        s.isParsingResume = false;
        s.error = payload;
      })

      // ── getResumeImprovements ──────────────────────────────────────────────
      .addCase(getResumeImprovements.pending, (s) => {
        s.isGettingImprovements = true;
        s.error = null;
      })
      .addCase(getResumeImprovements.fulfilled, (s, { payload }) => {
        s.isGettingImprovements = false;
        s.resumeImprovements = payload;
      })
      .addCase(getResumeImprovements.rejected, (s, { payload }) => {
        s.isGettingImprovements = false;
        s.error = payload;
      })

      // ── getCareerFeedback ──────────────────────────────────────────────────
      .addCase(getCareerFeedback.pending, (s) => {
        s.isGettingCareerFeedback = true;
        s.error = null;
      })
      .addCase(getCareerFeedback.fulfilled, (s, { payload }) => {
        s.isGettingCareerFeedback = false;
        s.careerFeedback = payload;
      })
      .addCase(getCareerFeedback.rejected, (s, { payload }) => {
        s.isGettingCareerFeedback = false;
        s.error = payload;
      })

      // ── generateJobDescription ─────────────────────────────────────────────
      .addCase(generateJobDescription.pending, (s) => {
        s.isGeneratingJobDescription = true;
        s.error = null;
      })
      .addCase(generateJobDescription.fulfilled, (s, { payload }) => {
        s.isGeneratingJobDescription = false;
        s.jobDescription = payload;
      })
      .addCase(generateJobDescription.rejected, (s, { payload }) => {
        s.isGeneratingJobDescription = false;
        s.error = payload;
      })

      // ── generateJobRequirements ────────────────────────────────────────────
      .addCase(generateJobRequirements.pending, (s) => {
        s.isGeneratingJobRequirements = true;
        s.error = null;
      })
      .addCase(generateJobRequirements.fulfilled, (s, { payload }) => {
        s.isGeneratingJobRequirements = false;
        s.jobRequirements = payload;
      })
      .addCase(generateJobRequirements.rejected, (s, { payload }) => {
        s.isGeneratingJobRequirements = false;
        s.error = payload;
      })

      // ── suggestSalary ──────────────────────────────────────────────────────
      .addCase(suggestSalary.pending, (s) => {
        s.isSuggestingSalary = true;
        s.error = null;
      })
      .addCase(suggestSalary.fulfilled, (s, { payload }) => {
        s.isSuggestingSalary = false;
        s.salarySuggestion = payload;
      })
      .addCase(suggestSalary.rejected, (s, { payload }) => {
        s.isSuggestingSalary = false;
        s.error = payload;
      })

      // ── recommendJobSkills ─────────────────────────────────────────────────
      .addCase(recommendJobSkills.pending, (s) => {
        s.isRecommendingSkills = true;
        s.error = null;
      })
      .addCase(recommendJobSkills.fulfilled, (s, { payload }) => {
        s.isRecommendingSkills = false;
        s.recommendedSkills = payload;
      })
      .addCase(recommendJobSkills.rejected, (s, { payload }) => {
        s.isRecommendingSkills = false;
        s.error = payload;
      })

      // ── generateJobResponsibilities ────────────────────────────────────────
      .addCase(generateJobResponsibilities.pending, (s) => {
        s.isGeneratingJobResponsibilities = true;
        s.error = null;
      })
      .addCase(generateJobResponsibilities.fulfilled, (s, { payload }) => {
        s.isGeneratingJobResponsibilities = false;
        s.jobResponsibilities = payload;
      })
      .addCase(generateJobResponsibilities.rejected, (s, { payload }) => {
        s.isGeneratingJobResponsibilities = false;
        s.error = payload;
      })

      // ── generateJobBenefits ────────────────────────────────────────────────
      .addCase(generateJobBenefits.pending, (s) => {
        s.isGeneratingJobBenefits = true;
        s.error = null;
      })
      .addCase(generateJobBenefits.fulfilled, (s, { payload }) => {
        s.isGeneratingJobBenefits = false;
        s.jobBenefits = payload;
      })
      .addCase(generateJobBenefits.rejected, (s, { payload }) => {
        s.isGeneratingJobBenefits = false;
        s.error = payload;
      })

      // ── recommendJobTags ───────────────────────────────────────────────────
      .addCase(recommendJobTags.pending, (s) => {
        s.isRecommendingTags = true;
        s.error = null;
      })
      .addCase(recommendJobTags.fulfilled, (s, { payload }) => {
        s.isRecommendingTags = false;
        s.recommendedTags = payload;
      })
      .addCase(recommendJobTags.rejected, (s, { payload }) => {
        s.isRecommendingTags = false;
        s.error = payload;
      })

      // ── enhanceSearch ──────────────────────────────────────────────────────
      .addCase(enhanceSearch.pending, (s) => {
        s.isEnhancingSearch = true;
        s.error = null;
      })
      .addCase(enhanceSearch.fulfilled, (s, { payload }) => {
        s.isEnhancingSearch = false;
        s.searchEnhancement = payload;
      })
      .addCase(enhanceSearch.rejected, (s, { payload }) => {
        s.isEnhancingSearch = false;
        s.error = payload;
      })
  },
});

export const {
  clearScreeningScore,
  clearSkillsGap,
  clearInterviewQuestions,
  clearNotesSummary,
  clearResumeSummary,
  clearExperienceBullets,
  clearResumeParseResult,
  clearResumeImprovements,
  clearCareerFeedback,
  clearAiError,
  clearJobDescription,
  clearJobRequirements,
  clearSalarySuggestion,
  clearRecommendedSkills,
  clearJobResponsibilities,
  clearJobBenefits,
  clearRecommendedTags,
  clearBulkScreening,
  clearHiringInsights,
  clearSearchEnhancement,
} = aiSlice.actions;

export default aiSlice.reducer;
