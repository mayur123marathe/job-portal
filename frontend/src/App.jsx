import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

// Auth Components
import AppBootstrap from "./components/auth/AppBootstrap";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User/Job Seeker Pages
import UserLayout from "./components/user/layout/UserLayout";
import JobsPage from "./pages/user/Jobs";
import JobDetails from "./pages/user/JobDetails";
import ApplyJob from "./pages/user/ApplyJob";
import UserApplications from "./pages/user/Applications";
import Profile from "./pages/user/Profile";
import Resumes from "./pages/user/Resumes";
import ResumeEdit from "./pages/user/ResumeEdit";
import ResumeView from "./pages/user/ResumeView";
import SavedJobs from "./pages/user/SavedJobs";
import AITools from "./pages/user/AITools"
import AIMatch from "./pages/user/AIMatch";
import UserSettings from "./pages/user/Settings";

// Employer Pages
import DashboardLayout from "./components/employer/layout/DashboardLayout";
import Dashboard from "./pages/employer/Dashboard";
import EmployerJobs from "./pages/employer/Jobs";
import CreateJob from "./pages/employer/CreateJob";
import EditJob from "./pages/employer/EditJob";
import Applications from "./pages/employer/Applications";

import ApplicationScreeningPage from "./pages/employer/ApplicationScreeningPage";
import Candidates from "./pages/employer/Candidates";

import Messages from "./pages/employer/Messages";
import CompanyProfile from "./pages/employer/CompanyProfile";
import BillingOverview from "./pages/employer/billing/BillingOverview";
import Plans from "./pages/employer/billing/Plans";
import PaymentDetails from "./pages/employer/billing/PaymentDetails";
import Invoices from "./pages/employer/billing/Invoices";
import Settings from "./pages/employer/Settings";

// Admin Pages
import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminJobs from "./pages/admin/Jobs";
import AdminCompanies from "./pages/admin/Companies";
import AdminSettings from "./pages/admin/Settings";
import AdminJobMeta from "./pages/admin/JobMeta";
import AdminSubscriptions from "./pages/admin/Subscriptions";
import { useEffect } from "react";
import { fetchCurrentUser } from "./store/user/userThunk";
import { useDispatch } from "react-redux";
import AIScreening from "./pages/employer/AiScreening/AIScreening";
import ApplicationDetail from "./pages/employer/Applications/ApplicationDetail";

function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken){
      dispatch(fetchCurrentUser());
    }
    
  },[])
  return (
    <Router>
      <AppBootstrap>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes - Accessible to everyone */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Job Seeker Routes - Protected and Role-Based */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={<RoleBasedRoute allowedRoles={["ROLE_JOB_SEEKER"]} />}
            >
              {/* Full-page routes without UserLayout (own top bars) */}
              <Route path="/resumes/:id/edit" element={<ResumeEdit />} />
              <Route path="/resumes/:id/view" element={<ResumeView />} />

              {/* Standard layout routes */}
              <Route element={<UserLayout />}>
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/apply/:id" element={<ApplyJob />} />
                <Route path="/applications" element={<UserApplications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/resumes" element={<Resumes />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/ai-match" element={<AIMatch />} />
                <Route path="/settings" element={<UserSettings />} />
              </Route>
            </Route>
          </Route>

          {/* Employer Routes - Protected and Role-Based */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleBasedRoute allowedRoles={["ROLE_EMPLOYER"]} />}>
              <Route path="/employer" element={<DashboardLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="jobs" element={<EmployerJobs />} />
                <Route path="jobs/create" element={<CreateJob />} />
                <Route path="jobs/:id/edit" element={<EditJob />} />
                <Route path="applications" element={<Applications />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
                <Route path="applications/:id/screening" element={<ApplicationScreeningPage />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="ai-screening" element={<AIScreening />} />
                <Route path="messages" element={<Messages />} />
                <Route path="company" element={<CompanyProfile />} />
                <Route path="billing" element={<BillingOverview />} />
                <Route path="billing/plans" element={<Plans />} />
                <Route path="billing/payment" element={<PaymentDetails />} />
                <Route path="billing/invoices" element={<Invoices />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Routes - Protected and Role-Based */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleBasedRoute allowedRoles={["ROLE_ADMIN"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="companies" element={<AdminCompanies />} />
                <Route path="job-meta" element={<AdminJobMeta />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all Route - Redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppBootstrap>
    </Router>
  );
}

export default App;
