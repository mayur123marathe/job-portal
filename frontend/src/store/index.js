import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./user/userAuth"
import jobReducer from "./job/jobSlice"
import companyReducer from "./company/companySlice"
import adminUserReducer from "./adminUser/adminUserSlice"
import jobMetaReducer from "./jobMeta/jobMetaSlice"
import applicationReducer from "./application/applicationSlice"
import subscriptionReducer from "./subscription/subscriptionSlice"
import resumeReducer from "./resume/resumeSlice"
import savedJobReducer from "./savedJob/savedJobSlice"
import aiReducer from "./ai/aiSlice"

// Configure store
const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
    company: companyReducer,
    adminUser: adminUserReducer,
    jobMeta: jobMetaReducer,
    application: applicationReducer,
    subscription: subscriptionReducer,
    resume: resumeReducer,
    savedJob: savedJobReducer,
    ai: aiReducer,
  }
})

export default store
