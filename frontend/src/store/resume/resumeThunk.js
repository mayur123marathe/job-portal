import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api"

// ── Resume CRUD ───────────────────────────────────────────────────────────────

export const fetchMyResumes = createAsyncThunk("resume/fetchMy",
  async (_, { rejectWithValue }) => {
    try { return (await api.get("/api/resumes/my")).data }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Failed to fetch resumes") }
  }
)

export const fetchResumeById = createAsyncThunk("resume/fetchById",
  async (resumeId, { rejectWithValue }) => {
    try { return (await api.get(`/api/resumes/${resumeId}`)).data }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Failed to fetch resume") }
  }
)

export const createResume = createAsyncThunk("resume/create",
  async (payload, { rejectWithValue }) => {
    try { return (await api.post("/api/resumes", payload)).data }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Failed to create resume") }
  }
)

export const setDefaultResume = createAsyncThunk("resume/setDefault",
  async (resumeId, { rejectWithValue }) => {
    try { return (await api.patch(`/api/resumes/${resumeId}/set-default`)).data }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Failed to set default resume") }
  }
)

export const updateResumeSummary = createAsyncThunk("resume/updateSummary",
  async ({ resumeId, summary }, { rejectWithValue }) => {
    try { return (await api.patch(`/api/resumes/${resumeId}/summary`, null, { params: { summary } })).data }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Failed to update summary") }
  }
)

export const deleteResume = createAsyncThunk("resume/delete",
  async (resumeId, { rejectWithValue }) => {
    try { await api.delete(`/api/resumes/${resumeId}`); return resumeId }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Failed to delete resume") }
  }
)

// ── Resume metadata (title / template / visibility) ──────────────────────────

export const updateResume = createAsyncThunk("resume/update",
  async ({ resumeId, data }, { rejectWithValue }) => {
    try { return (await api.put(`/api/resumes/${resumeId}`, data)).data }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Failed to update resume") }
  }
)

// ── Personal Info ─────────────────────────────────────────────────────────────
// Returns full ResumeResponse (updates currentResume)

export const updatePersonalInfo = createAsyncThunk("resume/updatePersonalInfo",
  async ({ resumeId, data }, { rejectWithValue }) => {
    try { return (await api.put(`/api/resumes/${resumeId}/personal-info`, data)).data }
    catch (e) { return rejectWithValue(e.response?.data?.message || "Failed to update personal info") }
  }
)

// ── Section CRUD factory ──────────────────────────────────────────────────────
// Each section follows: POST → item, PUT → item, DELETE → itemId

function makeSection(name, path, idParam) {
  const add = createAsyncThunk(`resume/add${name}`,
    async ({ resumeId, data }, { rejectWithValue }) => {
      try { return (await api.post(`/api/resumes/${resumeId}/${path}`, data)).data }
      catch (e) { return rejectWithValue(e.response?.data?.message || `Failed to add ${name}`) }
    }
  )
  const update = createAsyncThunk(`resume/update${name}`,
    async ({ resumeId, [idParam]: itemId, data }, { rejectWithValue }) => {
      try { return (await api.put(`/api/resumes/${resumeId}/${path}/${itemId}`, data)).data }
      catch (e) { return rejectWithValue(e.response?.data?.message || `Failed to update ${name}`) }
    }
  )
  const del = createAsyncThunk(`resume/delete${name}`,
    async ({ resumeId, [idParam]: itemId }, { rejectWithValue }) => {
      try { await api.delete(`/api/resumes/${resumeId}/${path}/${itemId}`); return itemId }
      catch (e) { return rejectWithValue(e.response?.data?.message || `Failed to delete ${name}`) }
    }
  )
  return { add, update, del }
}

// Work Experience — /api/resumes/{resumeId}/work-experiences/{experienceId}
const workExp = makeSection("WorkExperience", "work-experiences", "experienceId")
export const addWorkExperience    = workExp.add
export const updateWorkExperience = workExp.update
export const deleteWorkExperience = workExp.del

// Education — /api/resumes/{resumeId}/educations/{educationId}
const edu = makeSection("Education", "educations", "educationId")
export const addEducation    = edu.add
export const updateEducation = edu.update
export const deleteEducation = edu.del

// Skills — /api/resumes/{resumeId}/skills/{skillId}
const skill = makeSection("Skill", "skills", "skillId")
export const addSkill    = skill.add
export const updateSkill = skill.update
export const deleteSkill = skill.del

// Projects — /api/resumes/{resumeId}/projects/{projectId}
const proj = makeSection("Project", "projects", "projectId")
export const addProject    = proj.add
export const updateProject = proj.update
export const deleteProject = proj.del

// Certifications — /api/resumes/{resumeId}/certifications/{certificationId}
const cert = makeSection("Certification", "certifications", "certificationId")
export const addCertification    = cert.add
export const updateCertification = cert.update
export const deleteCertification = cert.del

// Awards — /api/resumes/{resumeId}/awards/{awardId}
const awd = makeSection("Award", "awards", "awardId")
export const addAward    = awd.add
export const updateAward = awd.update
export const deleteAward = awd.del

// Languages — /api/resumes/{resumeId}/languages/{languageId}
const lang = makeSection("Language", "languages", "languageId")
export const addLanguage    = lang.add
export const updateLanguage = lang.update
export const deleteLanguage = lang.del
