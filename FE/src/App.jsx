import { useState, useEffect } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import User from "./pages/Manager/User";
import Dashboard from "./pages/Manager/Dashboard";
import Request from "./pages/Manager/Request";
import Semester from "./pages/Manager/Semester";
import ExamSlots from "./pages/Manager/ExamSlots";
import AttendanceCheck from "./pages/Manager/AttendanceCheck";
import Configs from "./pages/Manager/Configs";
import InvigilatorAttendance from "./pages/Manager/InvigilatorAttendance";
import InvigilatorFees from "./pages/Manager/InvigilatorFees";
import Subject from "./pages/Staff/Subject";
import Exam from "./pages/Staff/Exam";
import RoomSelectionPage from "./pages/Staff/Room";
import Exam_Schedule from "./pages/Staff/Exam_Schedule";
import Attendance from "./pages/Staff/Attendance";
import InvigilatorDashboard from "./pages/Invigilator/InvigilatorDashboard";
import InvigilatorRegistration from "./pages/Invigilator/InvigilatorRegistration";
import InvigilatorRequest from "./pages/Invigilator/InvigilatorRequest";
import InvigilatorRequestsList from "./pages/Invigilator/InvigilatorRequestList";
import { getUserInfo } from "./components/API/getUserInfo";
import { SemesterProvider } from "./components/Context/SemesterContext.jsx";
import { SemesterProviderInvigilator } from "./components/SemesterContext.jsx";
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
  STAFF_ASSIGNMENT_URL,
  MANAGER_INVIGILATOR_ATTENDANCE_URL,
  MANAGER_INVIGILATOR_FEES_URL,
  MANAGER_CONFIGS_URL,
} from "./configs/urlWeb.js";
import "./App.css";
import ProfilePage from "./pages/Home/Profile.jsx";
import Header from "./components/Header/Header.jsx";
import HandlePassword from "./pages/Login/HandlePassword.jsx";
import AssignmentInvigilator from "./pages/Staff/Assignment.jsx";
import InvigilatorReport from "./pages/Invigilator/InvigilatorReport.jsx";
import InvigilatorAttend from "./pages/Invigilator/InvigilatorAttend.jsx";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [passwordSet, setPasswordSet] = useState(null); // Track password status
  const navigate = useNavigate();

  const initLogin = async () => {
    try {
      const user = await getUserInfo();
      if (user) {
        const userRole = user.role || null;
        setRole(userRole);
        setUser(user);
        setIsLogin(true);
        setPasswordSet(user.passwordSet); // Fetch password set status from API
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initLogin();
  }, []);

  useEffect(() => {
    // Redirect to /add only if passwordSet === false
    if (isLogin && passwordSet === false) {
      navigate("/add");
    }
  }, [isLogin, passwordSet, navigate]);

  // Remove duplicate NotFound route
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
        {role === 1 && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path={MANAGER_DASHBOARD_URL} element={<Dashboard />} />
            <Route path={MANAGER_SEMESTER_URL} element={<Semester />} />
            <Route path={MANAGER_USERS_URL} element={<User />} />
            <Route path={MANAGER_REQUESTS_URL} element={<Request />} />
            <Route path={MANAGER_EXAM_SCHEDULE_URL} element={<ExamSlots />} />
            <Route
              path={MANAGER_ATTENDENCE_CHECK_URL}
              element={<AttendanceCheck />}
            />
            <Route path={MANAGER_CONFIGS_URL} element={<Configs />} />
            <Route
              path={MANAGER_INVIGILATOR_ATTENDANCE_URL}
              element={<InvigilatorAttendance />}
            />
            <Route
              path={MANAGER_INVIGILATOR_FEES_URL}
              element={<InvigilatorFees />}
            />
          </>
        )}
        {/* Staff Routes */}
        {role === 2 && (
          <>
            <Route path="/" element={<Subject />} />
            <Route path={STAFF_SUBJECT_URL} element={<Subject />} />
            <Route path={STAFF_EXAM_URL} element={<Exam />} />
            <Route path={STAFF_EXAM_SCHEDULE_URL} element={<Exam_Schedule />} />
            <Route path={STAFF_ATTENDANCE_URL} element={<Attendance />} />
            <Route
              path={STAFF_ROOM_SELECTION_URL}
              element={<RoomSelectionPage />}
            />
            <Route
              path={STAFF_ASSIGNMENT_URL}
              element={<AssignmentInvigilator />}
            />
          </>
        )}
        {/* Invigilator Routes */}
        {role === 3 && (
          <>
            <Route path="/" element={<InvigilatorDashboard />} />
            <Route path="/register" element={<InvigilatorRegistration />} />
            <Route path="/request/send" element={<InvigilatorRequest />} />
            <Route path="/request/view" element={<InvigilatorRequestsList />} />
            <Route path="/report" element={<InvigilatorReport />} />
            <Route path="/attendance" element={<InvigilatorAttend />} />
          </>
        )}
        {/* Common Routes */}
        <Route path="profile" element={<ProfilePage user={user} />} />
        <Route path="add" element={<HandlePassword />} />
        <Route path="*" element={<Navigate to="/add" replace />} />{" "}
        {/* Catch-all route */}
      </Routes>
    );
  };

  return (
    <div className="container">
      {role === 1 || role === 2 ? (
        <SemesterProvider>{renderRoutes()}</SemesterProvider>
      ) : (
        <>
          {role === 3 && <Header />}
          <SemesterProviderInvigilator>
            {renderRoutes()}
          </SemesterProviderInvigilator>
        </>
      )}
    </div>
  );
}

export default App;
