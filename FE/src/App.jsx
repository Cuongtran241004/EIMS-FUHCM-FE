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

  useEffect(() => {
    const initLogin = async () => {
      const name = await getUserInfo();
      setIsLogin(!!name);
      setIsLoading(false);
    };
    initLogin();
  }, [isLogin]);

  return (
    <>
      <div className="container">
        {!isLogin ? (
          <Routes>
            <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Routes>
            {/* <Route path={MANAGER_DASHBOARD_URL} element={<Dashboard />} />
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
            /> */}

            <Route path={STAFF_SUBJECT_URL} element={<Subject />} />
            <Route path={STAFF_EXAM_URL} element={<Exam />} />
            <Route path={STAFF_EXAM_SCHEDULE_URL} element={<Exam_Schedule />} />
            <Route path={STAFF_ATTENDANCE_URL} element={<Attendance />} />
            <Route
              path="*"
              element={<Navigate to={STAFF_SUBJECT_URL} replace />}
            />
          </Routes>
        )}
      </div>
    </>
  );
}

export default App;
