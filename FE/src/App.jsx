import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import User from "./pages/Manager/User";
import Dashboard from "./pages/Manager/Dashboard";
import Request from "./pages/Manager/Request";
import Semester from "./pages/Manager/Semester";
import ExamSlots from "./pages/Manager/ExamSlots";
import Subject from "./pages/Staff/Subject";
import Exam from "./pages/Staff/Exam";
import Exam_Schedule from "./pages/Staff/Exam_Schedule";
import Attendance from "./pages/Staff/Attendance";
import InvigilatorDashboard from "./pages/Invigilator/InvigilatorDashboard";
import InvigilatorRegistration from "./pages/Invigilator/InvigilatorRegistration";
import InvigilatorRequest from "./pages/Invigilator/InvigilatorRequest";
import AttendanceCheck from "./pages/Manager/AttendanceCheck";
import RoomSelectionPage from "./pages/Staff/Room";
import { getUserInfo } from "./components/API/getUserInfo";
import { SemesterProvider } from "./components/Context/SemesterContext.jsx";
import {
  MANAGER_ATTENDENCE_CHECK_URL,
  MANAGER_DASHBOARD_URL,
  MANAGER_EXAM_SCHEDULE_URL,
  MANAGER_REQUESTS_URL,
  MANAGER_SEMESTER_URL,
  MANAGER_USERS_URL,
  STAFF_ATTENDANCE_URL,
  STAFF_EXAM_SCHEDULE_URL,
  STAFF_EXAM_URL,
  STAFF_ROOM_SELECTION_URL,
  STAFF_SUBJECT_URL,
} from "./configs/urlWeb.js";
import "./App.css";
import ProfilePage from "./pages/Home/Profile.jsx";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const initLogin = async () => {
    try {
      const user = await getUserInfo();
      if (user) {
        const userRole = user.role.name || null;
        setRole(userRole);
        setUser(user);
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Failed to get user info:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    initLogin();
  }, []);

  const renderRoutes = () => {
    if (!isLogin) {
      return (
        <Routes>
          <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    }

    return (
      <Routes>
        {/* Manager Routes */}
        {role === "manager" && (
          <>
            <Route path={MANAGER_DASHBOARD_URL} element={<Dashboard />} />
            <Route path={MANAGER_SEMESTER_URL} element={<Semester />} />
            <Route path={MANAGER_USERS_URL} element={<User />} />
            <Route path={MANAGER_REQUESTS_URL} element={<Request />} />
            <Route path={MANAGER_EXAM_SCHEDULE_URL} element={<ExamSlots />} />
            <Route
              path={MANAGER_ATTENDENCE_CHECK_URL}
              element={<AttendanceCheck />}
            />
            <Route
              path="*"
              element={<Navigate to={MANAGER_DASHBOARD_URL} replace />}
            />
          </>
        )}

        {/* Staff Routes */}
        {role === "staff" && (
          <>
            <Route path={STAFF_SUBJECT_URL} element={<Subject />} />
            <Route path={STAFF_EXAM_URL} element={<Exam />} />
            <Route path={STAFF_EXAM_SCHEDULE_URL} element={<Exam_Schedule />} />
            <Route path={STAFF_ATTENDANCE_URL} element={<Attendance />} />
            <Route
              path={STAFF_ROOM_SELECTION_URL}
              element={<RoomSelectionPage />}
            />
            <Route
              path="*"
              element={<Navigate to={STAFF_SUBJECT_URL} replace />}
            />
          </>
        )}

        {/* Invigilator Routes */}
        {role === "invigilator" && (
          <>
            <Route path="/" element={<InvigilatorDashboard />} />
            <Route path="/register" element={<InvigilatorRegistration />} />
            <Route path="/request" element={<InvigilatorRequest />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
        <Route path="profile" element={<ProfilePage user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };

  return (
    <div className="container">
      {role === "staff" || role === "manager" ? (
        <SemesterProvider>{renderRoutes()}</SemesterProvider>
      ) : (
        renderRoutes()
      )}
    </div>
  );
}

export default App;
