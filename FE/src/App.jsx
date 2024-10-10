import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import Staff from "./pages/Manager/Staff";
import Dashboard from "./pages/Dashboard/Dashboard";
import Request from "./pages/Request/Request";
import Invigilator from "./pages/Manager/Invigilator";
import Semester from "./pages/Manager/Semester";
import ExamSlots from "./pages/Exam/ExamSlots";
import ConfigSettings from "./pages/Manager/Config";
import { getUserInfo } from "./components/API/getUserInfo";
import Header from "./components/Header/Header";
import Subject from "./pages/Staff/Subject";
import Exam from "./pages/Staff/Exam";
import Exam_Schedule from "./pages/Staff/Exam_Schedule";
import Attendance from "./pages/Staff/Attendance";
import InvigilatorDashboard from "./pages/Invigilator/InvigilatorDashboard";
import InvigilatorRegistration from "./pages/Invigilator/InvigilatorRegistration";
import InvigilatorRequest from "./pages/Invigilator/InvigilatorRequest";
import headerConfig from "./configs/headerConfig";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const initLogin = async () => {
      const name = await getUserInfo();
      const userRole = localStorage.getItem("role");
      setIsLogin(!!name);
      setRole(userRole);
      setIsLoading(false);
    };
    initLogin();
  }, []);

  const renderRoutes = () => {
    return (
      <Routes>
        {role === "Manager" && (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/semester" element={<Semester />} />
            <Route path="/staffs" element={<Staff />} />
            <Route path="/invigilators" element={<Invigilator />} />
            <Route path="/exam-slot" element={<ConfigSettings />} />
          </>
        )}

        {role === "Staff" && (
          <>
            <Route path="/" element={<Subject />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/exam-schedule" element={<Exam_Schedule />} />
            <Route path="/attendance" element={<Attendance />} />
          </>
        )}

        {role === "Invigilator" && (
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
        {isLoading ? (
          <div>Loading...</div>
        ) : !isLogin ? (
          <Routes>
            <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (

          <>
            <Header />
            {renderRoutes()}
          </>
        )}
      </div>
    </>
  );
}

export default App;
