import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api"

// POST /api/ai/application/cover-letter
// CoverLetterRequest → ApiResponse<AiTextResponse>
export const generateCoverLetter = createAsyncThunk(
  "ai/generateCoverLetter",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/application/cover-letter", payload)
      return data.data   // unwrap ApiResponse wrapper
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate cover letter")
    }
  }
)

// POST /api/ai/application/screening-score
// ScreeningScoreRequest → ApiResponse<ScreeningScoreResponse>
export const scoreCandidate = createAsyncThunk(
  "ai/scoreCandidate",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/application/screening-score", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to score candidate")
    }
  }
)

// POST /api/ai/application/interview-questions
// InterviewQuestionsRequest → ApiResponse<InterviewQuestionsResponse>
export const generateInterviewQuestions = createAsyncThunk(
  "ai/generateInterviewQuestions",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/application/interview-questions", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate interview questions")
    }
  }
)

// POST /api/ai/application/skills-gap
// SkillsGapRequest → ApiResponse<SkillsGapResponse>
export const analyzeSkillsGap = createAsyncThunk(
  "ai/analyzeSkillsGap",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/application/skills-gap", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to analyze skills gap")
    }
  }
)

// POST /api/ai/application/summarize-notes
// List<String> notes → ApiResponse<AiTextResponse>
export const summarizeNotes = createAsyncThunk(
  "ai/summarizeNotes",
  async (notes, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/application/summarize-notes", notes)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to summarize notes")
    }
  }
)

// ── Resume AI ──────────────────────────────────────────────────────────────────

// POST /api/ai/resume/summary
// ResumeSummaryRequest → ApiResponse<AiTextResponse>
export const generateResumeSummary = createAsyncThunk(
  "ai/generateResumeSummary",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/resume/summary", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate resume summary")
    }
  }
)

// POST /api/ai/resume/experience-bullets
// WorkExperienceBulletRequest → ApiResponse<WorkExperienceBulletsResponse>
export const generateExperienceBullets = createAsyncThunk(
  "ai/generateExperienceBullets",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/resume/experience-bullets", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate bullet points")
    }
  }
)

// POST /api/ai/resume/parse
// ResumeParseRequest → ApiResponse<ResumeParseResponse>
export const parseResumeText = createAsyncThunk(
  "ai/parseResumeText",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/resume/parse", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to parse resume")
    }
  }
)

// POST /api/ai/resume/improvements
// ResumeImprovementRequest → ApiResponse<ResumeImprovementResponse>
export const getResumeImprovements = createAsyncThunk(
  "ai/getResumeImprovements",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/resume/improvements", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get improvement suggestions")
    }
  }
)

// POST /api/ai/resume/career-feedback
// CareerFeedbackRequest { resumeContent, targetJobTitle? }
// → ApiResponse<CareerFeedbackResponse> { profileStrength, shortlistingIssues[], improvements[], targetJobs[], overallSummary }
export const getCareerFeedback = createAsyncThunk(
  "ai/getCareerFeedback",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/resume/career-feedback", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to get career feedback")
    }
  }
)

// ── Job AI ─────────────────────────────────────────────────────────────────────

// POST /api/ai/job/describe
// JobDescriptionRequest { title, skills, experienceLevel, jobType, workMode, category, additionalContext }
// → ApiResponse<AiTextResponse> { content, generatedAt }
export const generateJobDescription = createAsyncThunk(
  "ai/generateJobDescription",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/job/describe", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate job description")
    }
  }
)

// GET /api/ai/job/requirements?title=...&category=...
// → ApiResponse<AiTextResponse> { content, generatedAt }
export const generateJobRequirements = createAsyncThunk(
  "ai/generateJobRequirements",
  async ({ title, category }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/job/requirements", { params: { title, category } })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate job requirements")
    }
  }
)

// POST /api/ai/job/salary-suggestion
// SalaryRangeRequest { title, skills, experienceLevel, jobType, location }
// → ApiResponse<SalaryRangeResponse> { minSalary, maxSalary, currency, period, marketInsight }
export const suggestSalary = createAsyncThunk(
  "ai/suggestSalary",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/job/salary-suggestion", payload)
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to suggest salary")
    }
  }
)

// GET /api/ai/job/skills-recommendation?title=...&description=...
// → ApiResponse<AiTextResponse> { content, generatedAt }
export const recommendJobSkills = createAsyncThunk(
  "ai/recommendJobSkills",
  async ({ title, description }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/job/skills-recommendation", { params: { title, description } })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to recommend skills")
    }
  }
)

// GET /api/ai/job/responsibilities?title=...&category=...
// → ApiResponse<AiTextResponse> { content, generatedAt }
export const generateJobResponsibilities = createAsyncThunk(
  "ai/generateJobResponsibilities",
  async ({ title, category }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/job/responsibilities", { params: { title, category } })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate responsibilities")
    }
  }
)

// GET /api/ai/job/benefits?title=...&category=...&jobType=...
// → ApiResponse<AiTextResponse> { content, generatedAt }
export const generateJobBenefits = createAsyncThunk(
  "ai/generateJobBenefits",
  async ({ title, category, jobType }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/job/benefits", { params: { title, category, jobType } })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to generate benefits")
    }
  }
)

// GET /api/ai/job/tags-recommendation?title=...&description=...
// → ApiResponse<AiTextResponse> { content, generatedAt }
export const recommendJobTags = createAsyncThunk(
  "ai/recommendJobTags",
  async ({ title, description }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/ai/job/tags-recommendation", { params: { title, description } })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to recommend tags")
    }
  }
)

// ── Search AI ──────────────────────────────────────────────────────────────────

// POST /api/ai/search/enhance
// SearchEnhanceRequest { query } → ApiResponse<SearchEnhanceResponse>
// SearchEnhanceResponse: { keywords[], locations[], jobTypes[], workModes[], experienceLevels[], minSalary, skills[] }
export const enhanceSearch = createAsyncThunk(
  "ai/enhanceSearch",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/ai/search/enhance", { query })
      return data.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to enhance search")
    }
  }
)



