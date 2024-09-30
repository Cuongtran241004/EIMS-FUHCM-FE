import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Staff from "./pages/Manager/Staff";
import Dashboard from "./pages/Dashboard/Dashboard";
import Request from "./pages/Request/Request";
import Invigilator from "./pages/Manager/Invigilator";
import Semester from "./pages/Manager/Semester";
import Subject from "./pages/Manager/Subject";
import ExamSlots from "./pages/Exam/ExamSlots";
import ConfigSettings from "./pages/Manager/Config";
import { getUserInfo } from "./components/API/getUserInfo";
import Header_Manager from "./components/Header/Header_Manager";


function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const initLogin = async () => {
      const name = await getUserInfo();
      setIsLogin(!!name);
    };
    initLogin();
  }, []);


  return (
    <>
      <div className="container">
      {isLogin && <Header_Manager isLogin={isLogin} />}

        {!isLogin ? (
          <Routes>
            <Route path="/" element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/semester" element={<Semester />} />
            <Route path="/subjects" element={<Subject />} />
            <Route path="/staffs" element={<Staff />} />
            <Route path="/invigilators" element={<Invigilator />} />
            <Route path="/exam-slot" element={<ConfigSettings />} />
            <Route path="/requests" element={<Request />} />
            <Route path="/exam-schedule" element={<ExamSlots />} />
            {/* Điều hướng bất kỳ đường dẫn nào không xác định về dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )};







      </div>
    </>
  );
}

export default App;