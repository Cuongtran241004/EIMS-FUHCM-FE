import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import User from "./pages/Manager/User";
import Dashboard from "./pages/Manager/Dashboard";
import Request from "./pages/Manager/Request";
import Semester from "./pages/Manager/Semester";
import ExamSlots from "./pages/Manager/ExamSlots";
import { getUserInfo } from "./components/API/getUserInfo";
import Subject from "./pages/Staff/Subject";
import Exam from "./pages/Staff/Exam";
import Exam_Schedule from "./pages/Staff/Exam_Schedule";
import Attendance from "./pages/Staff/Attendance";
import InvigilatorDashboard from "./pages/Invigilator/InvigilatorDashboard";
import InvigilatorRegistration from "./pages/Invigilator/InvigilatorRegistration";
import InvigilatorRequest from "./pages/Invigilator/InvigilatorRequest";
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
  STAFF_SUBJECT_URL,
} from "./configs/urlWeb";
import AttendanceCheck from "./pages/Manager/AttendanceCheck";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const initLogin = async () => {
      const name = await getUserInfo();
      if (name) {
        const userRole = name.role.name || null;
        setRole(userRole);
      }
      setIsLogin(!!name);
      setIsLoading(false);
    };
    initLogin();
  }, []);

  useEffect(() => {
    if (isLogin) {
    }
  }, [isLogin]);

  const renderRoutes = () => {
    return (
      <Routes>
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

        {role === "staff" && (
          <>
            <Route path={STAFF_SUBJECT_URL} element={<Subject />} />
            <Route path={STAFF_EXAM_URL} element={<Exam />} />
            <Route path={STAFF_EXAM_SCHEDULE_URL} element={<Exam_Schedule />} />
            <Route path={STAFF_ATTENDANCE_URL} element={<Attendance />} />
            <Route
              path="*"
              element={<Navigate to={STAFF_SUBJECT_URL} replace />}
            />
          </>
        )}

        {role === "invigilator" && (
          <>
            <Route path="/" element={<InvigilatorDashboard />} />
            <Route path="/register" element={<InvigilatorRegistration />} />
            <Route path="/request" element={<InvigilatorRequest />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };
  return (
    <>
      <div className="container">
        {!isLogin ? (
          <Routes>
            <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          renderRoutes()
        )}
      </div>
    </>
  );
}

export default App;
