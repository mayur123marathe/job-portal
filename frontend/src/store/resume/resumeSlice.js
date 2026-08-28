import { createSlice } from "@reduxjs/toolkit"
import {
  fetchMyResumes, fetchResumeById,
  createResume, updateResume, setDefaultResume, updateResumeSummary, deleteResume,
  updatePersonalInfo,
  addWorkExperience, updateWorkExperience, deleteWorkExperience,
  addEducation,      updateEducation,      deleteEducation,
  addSkill,          updateSkill,          deleteSkill,
  addProject,        updateProject,        deleteProject,
  addCertification,  updateCertification,  deleteCertification,
  addAward,          updateAward,          deleteAward,
  addLanguage,       updateLanguage,       deleteLanguage,
} from "./resumeThunk"

// ── Helper: register add / update / delete cases for one section array ────────
function registerSection(builder, { add, update, del }, key) {
  builder
    .addCase(add.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
    .addCase(add.fulfilled, (s, { payload }) => {
      s.isActionLoading = false
      if (s.currentResume) s.currentResume[key] = [...(s.currentResume[key] ?? []), payload]
    })
    .addCase(add.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

  builder
    .addCase(update.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
    .addCase(update.fulfilled, (s, { payload }) => {
      s.isActionLoading = false
      if (s.currentResume?.[key]) {
        const i = s.currentResume[key].findIndex((x) => x.id === payload.id)
        if (i !== -1) s.currentResume[key][i] = payload
      }
    })
    .addCase(update.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

  builder
    .addCase(del.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
    .addCase(del.fulfilled, (s, { payload: id }) => {
      s.isActionLoading = false
      if (s.currentResume?.[key]) s.currentResume[key] = s.currentResume[key].filter((x) => x.id !== id)
    })
    .addCase(del.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    resumes:         [],
    currentResume:   null,
    isLoading:       false,
    isActionLoading: false,
    error:           null,
    actionError:     null,
  },
  reducers: {
    clearCurrentResume(s) { s.currentResume = null },
    clearErrors(s) { s.error = null; s.actionError = null },
  },
  extraReducers: (builder) => {

    // fetchMyResumes
    builder
      .addCase(fetchMyResumes.pending,   (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchMyResumes.fulfilled, (s, { payload }) => { s.isLoading = false; s.resumes = payload })
      .addCase(fetchMyResumes.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // fetchResumeById — loads full resume with all sections
    builder
      .addCase(fetchResumeById.pending,   (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchResumeById.fulfilled, (s, { payload }) => { s.isLoading = false; s.currentResume = payload })
      .addCase(fetchResumeById.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // createResume
    builder
      .addCase(createResume.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
      .addCase(createResume.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.resumes.unshift(payload)
        if (payload.isDefault) s.resumes.forEach((r) => { if (r.id !== payload.id) r.isDefault = false })
      })
      .addCase(createResume.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // setDefaultResume
    builder
      .addCase(setDefaultResume.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
      .addCase(setDefaultResume.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.resumes = s.resumes.map((r) => ({ ...r, isDefault: r.id === payload.id }))
      })
      .addCase(setDefaultResume.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // updateResumeSummary — returns full ResumeResponse
    builder
      .addCase(updateResumeSummary.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
      .addCase(updateResumeSummary.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        const i = s.resumes.findIndex((r) => r.id === payload.id)
        if (i !== -1) s.resumes[i] = payload
        if (s.currentResume?.id === payload.id) s.currentResume = payload
      })
      .addCase(updateResumeSummary.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // deleteResume
    builder
      .addCase(deleteResume.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
      .addCase(deleteResume.fulfilled, (s, { payload: id }) => {
        s.isActionLoading = false
        s.resumes = s.resumes.filter((r) => r.id !== id)
        if (s.currentResume?.id === id) s.currentResume = null
      })
      .addCase(deleteResume.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // updateResume — title / template / visibility
    builder
      .addCase(updateResume.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
      .addCase(updateResume.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        if (s.currentResume?.id === payload.id) s.currentResume = payload
        const i = s.resumes.findIndex((r) => r.id === payload.id)
        if (i !== -1) s.resumes[i] = { ...s.resumes[i], title: payload.title, template: payload.template, visibility: payload.visibility }
      })
      .addCase(updateResume.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // updatePersonalInfo — returns full ResumeResponse
    builder
      .addCase(updatePersonalInfo.pending,   (s) => { s.isActionLoading = true; s.actionError = null })
      .addCase(updatePersonalInfo.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        if (s.currentResume?.id === payload.id) s.currentResume = payload
        const i = s.resumes.findIndex((r) => r.id === payload.id)
        if (i !== -1) s.resumes[i] = { ...s.resumes[i], completionScore: payload.completionScore }
      })
      .addCase(updatePersonalInfo.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── Section CRUD via helper ────────────────────────────────────────────────
    registerSection(builder, { add: addWorkExperience, update: updateWorkExperience, del: deleteWorkExperience }, "workExperiences")
    registerSection(builder, { add: addEducation,      update: updateEducation,      del: deleteEducation      }, "educations")
    registerSection(builder, { add: addSkill,          update: updateSkill,          del: deleteSkill          }, "skills")
    registerSection(builder, { add: addProject,        update: updateProject,        del: deleteProject        }, "projects")
    registerSection(builder, { add: addCertification,  update: updateCertification,  del: deleteCertification  }, "certifications")
    registerSection(builder, { add: addAward,          update: updateAward,          del: deleteAward          }, "awards")
    registerSection(builder, { add: addLanguage,       update: updateLanguage,       del: deleteLanguage       }, "languages")
  },
})

export const { clearCurrentResume, clearErrors } = resumeSlice.actions
export default resumeSlice.reducer
