import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProfile from "./pages/CreateProfile";
import Register from "./pages/Register";
import ApplicantsPage from "./pages/ApplicantsPage";
import EmailVerified from "./pages/EmailVerified";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/student"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/create-profile"
          element={
            <ProtectedRoute allowedRole="STUDENT">
              <CreateProfile />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/applicants/:driveId"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<Register />} />

        <Route path="/email-verified" element={<EmailVerified />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;