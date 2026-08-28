import { createSlice } from "@reduxjs/toolkit"
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
  fetchSkills, createSkill, updateSkill, deleteSkill,
  fetchTags, createTag, updateTag, deleteTag,
} from "./jobMetaThunk"

const initialState = {
  categories: [],
  skills: [],
  tags: [],
  isLoadingCategories: false,
  isLoadingSkills: false,
  isLoadingTags: false,
  isActionLoading: false,
  error: null,
  actionError: null,
}

function replaceById(list, updated) {
  return list.map((item) => (item.id === updated.id ? updated : item))
}

const jobMetaSlice = createSlice({
  name: "jobMeta",
  initialState,
  reducers: {
    clearErrors(state) {
      state.error = null
      state.actionError = null
    },
  },
  extraReducers: (builder) => {
    // ── Categories ─────────────────────────────────────────────────────────
    builder
      .addCase(fetchCategories.pending, (state) => { state.isLoadingCategories = true; state.error = null })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => { state.isLoadingCategories = false; state.categories = payload })
      .addCase(fetchCategories.rejected, (state, { payload }) => { state.isLoadingCategories = false; state.error = payload })

      .addCase(createCategory.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(createCategory.fulfilled, (state, { payload }) => { state.isActionLoading = false; state.categories.unshift(payload) })
      .addCase(createCategory.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

      .addCase(updateCategory.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(updateCategory.fulfilled, (state, { payload }) => { state.isActionLoading = false; state.categories = replaceById(state.categories, payload) })
      .addCase(updateCategory.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

      .addCase(deleteCategory.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(deleteCategory.fulfilled, (state, { payload: id }) => { state.isActionLoading = false; state.categories = state.categories.filter((c) => c.id !== id) })
      .addCase(deleteCategory.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── Skills ─────────────────────────────────────────────────────────────
    builder
      .addCase(fetchSkills.pending, (state) => { state.isLoadingSkills = true; state.error = null })
      .addCase(fetchSkills.fulfilled, (state, { payload }) => { state.isLoadingSkills = false; state.skills = payload })
      .addCase(fetchSkills.rejected, (state, { payload }) => { state.isLoadingSkills = false; state.error = payload })

      .addCase(createSkill.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(createSkill.fulfilled, (state, { payload }) => { state.isActionLoading = false; state.skills.unshift(payload) })
      .addCase(createSkill.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

      .addCase(updateSkill.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(updateSkill.fulfilled, (state, { payload }) => { state.isActionLoading = false; state.skills = replaceById(state.skills, payload) })
      .addCase(updateSkill.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

      .addCase(deleteSkill.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(deleteSkill.fulfilled, (state, { payload: id }) => { state.isActionLoading = false; state.skills = state.skills.filter((s) => s.id !== id) })
      .addCase(deleteSkill.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── Tags ───────────────────────────────────────────────────────────────
    builder
      .addCase(fetchTags.pending, (state) => { state.isLoadingTags = true; state.error = null })
      .addCase(fetchTags.fulfilled, (state, { payload }) => { state.isLoadingTags = false; state.tags = payload })
      .addCase(fetchTags.rejected, (state, { payload }) => { state.isLoadingTags = false; state.error = payload })

      .addCase(createTag.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(createTag.fulfilled, (state, { payload }) => { state.isActionLoading = false; state.tags.unshift(payload) })
      .addCase(createTag.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

      .addCase(updateTag.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(updateTag.fulfilled, (state, { payload }) => { state.isActionLoading = false; state.tags = replaceById(state.tags, payload) })
      .addCase(updateTag.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

      .addCase(deleteTag.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(deleteTag.fulfilled, (state, { payload: id }) => { state.isActionLoading = false; state.tags = state.tags.filter((t) => t.id !== id) })
      .addCase(deleteTag.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })
  },
})

export const { clearErrors } = jobMetaSlice.actions
export default jobMetaSlice.reducer
