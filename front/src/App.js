// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Student & Recruiter
import HomeStudent from "./components/Student/HomeStudent";
import HomeRecruiter from "./components/Recruiter/HomeRecruiter";

// Pages
import UploadPortfolio from "./pages/UploadPortfolio";
import WorkStatusPage from "./pages/WorkStatusPage";
import EditPage from "./pages/EditPage";
import StudentResubmit from "./pages/StudentResubmit";
import PortfolioFail from "./pages/PortfolioFail";
import CommentPage from "./pages/CommentPage";

// Advisor
import VerifyPortfolioAdvisor from "./components/AdminAdvisor/VerifyPortfolio";
import AdvisorReview from "./components/AdminAdvisor/AdvisorReview.jsx";

// Super Admin
import VerifyAcc from "./components/SuperAdmin/VerifyAcc";
import SuperReview from "./components/SuperAdmin/SuperReview.jsx";

import VerifyPortfolioSuper from "./components/SuperAdmin/VerifyPortfolioDone";
import UserApprovalDetail from "./components/SuperAdmin/UserApprovalDetail.jsx";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* default */}
      <Route path="/" element={<Navigate to="/student/home" replace />} />

      {/* Student */}
      <Route path="/student/home" element={<HomeStudent />} />
      <Route path="/student/portfolio-form" element={<UploadPortfolio />} />
      {/* หรืออยากใช้ /student/upload ก็ได้: <Route path="/student/upload" element={<UploadPortfolio />} /> */}
      <Route path="/student/status" element={<WorkStatusPage showControls={true} />} />
      <Route path="/student/edit/:id" element={<EditPage />} />
      <Route path="/student/resubmit/:id" element={<StudentResubmit />} />
      <Route path="/student/fail-status-error/:id" element={<PortfolioFail />} />

      {/* 🔓 Public detail สำหรับการ์ดในหน้า Home */}
      <Route path="/project/:id/public" element={<CommentPage />} />

      {/* internal comment (ของ approved ภายในระบบ) */}
      <Route path="/project/:projectId/comments" element={<CommentPage />} />

      {/* Recruiter */}
      <Route path="/recruiter/home" element={<HomeRecruiter />} />

      {/* Advisor */}
      <Route path="/advisor/veri-portfolio" element={<VerifyPortfolioAdvisor />} />
      <Route path="/advisor/review/:id" element={<AdvisorReview />} />

      {/* Super Admin */}
      <Route path="/super/verify" element={<VerifyPortfolioSuper />} />
      <Route path="/super/review/:id" element={<SuperReview />} />
      <Route path="/super/verify-acc" element={<VerifyAcc />} />
      <Route path="/super/user-approval/:id" element={<UserApprovalDetail />} /> 

      {/* 404 */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}
