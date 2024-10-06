import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import { Route, Routes, Navigate, useNavigate  } from "react-router-dom";
import "./App.css";
import Staff from "./pages/Manager/Staff";
import Dashboard from "./pages/Dashboard/Dashboard";
import Request from "./pages/Request/Request";
import Invigilator from "./pages/Manager/Invigilator";
import Semester from "./pages/Manager/Semester";
import ExamSlots from "./pages/Exam/ExamSlots";
import ConfigSettings from "./pages/Manager/Config";
import { getUserInfo } from "./components/API/getUserInfo";
import Header_Manager from "./components/Header/Header_Manager";
import Subject from "./pages/Staff/Subject";
import Exam from "./pages/Staff/Exam";
import Exam_Schedule from "./pages/Staff/Exam_Schedule";
import Attendance from "./pages/Staff/Attendance";
import InvigilatorDashboard from "./pages/Invigilator/InvigilatorDashboard";
import InvigilatorRegistration from "./pages/Invigilator/InvigilatorRegistration";
import InvigilatorRequest from "./pages/Invigilator/InvigilatorRequest";
import Header from "./components/Header/Header";
function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      console.log("Login");
      const initLogin = async () => {
        const name = await getUserInfo();
        setIsLogin(!!name);
        setIsLoading(false);
      };
      initLogin();
    }, [isLogin]);
 
  
  

  // return (
  //   <>
  //     <div className="container">
  //       {!isLogin ? (
  //         <Routes>
  //           <Route path="/" element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
  //           <Route path="*" element={<Navigate to="/" replace />} />
  //         </Routes>
  //       ) : (
  //         <Routes>
  //           <Route
  //             path="/"
  //             element={<Navigate to="/dashboard" replace />}
  //           />
  //           <Route path="/dashboard" element={<Dashboard isLogin={isLogin} />} />
  //           <Route path="/semester" element={<Semester isLogin={isLogin}/>} />
  // //           <Route path="/subjects" element={<Subject isLogin={isLogin}/>} />
  //           <Route path="/staffs" element={<Staff isLogin={isLogin}/>} />
  //           <Route path="/invigilators" element={<Invigilator isLogin={isLogin}/>} />
  //           <Route path="/exam-slot" element={<ConfigSettings isLogin={isLogin}/>} />
  //           <Route path="/requests" element={<Request isLogin={isLogin}/>} />
  //           <Route path="/exam-schedule" element={<ExamSlots isLogin={isLogin}/>} />

  //           {/* Điều hướng bất kỳ đường dẫn nào không xác định về dashboard */}
  //           <Route path="*" element={<Navigate to="/dashboard" replace />} />
  //         </Routes>
  //       )};
  //     </div>
  //   </>
  // );

  // return (
  //   <>
  //     <div className="container">
  //       <Routes>
  //         <Route path="/subject" element={<Subject />} />
  //         <Route path="/exam" element={<Exam />} />
  //         <Route path="/exam-schedule" element={<Exam_Schedule />} />
  //         <Route path="/attendance" element={<Attendance />} />
  //         {/* Điều hướng bất kỳ đường dẫn nào không xác định về dashboard */}
  //         <Route path="*" element={<Navigate to="/subject" replace />} />
  //       </Routes>
  //     </div>
  //   </>
  // );


  return (
    <>
      <div className="container">
        {!isLogin ? (
          <Routes>
            <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ) : (
           <div>
            {!isLoading && (
              <>
              <Header />
              </>
          )}
          <Routes>
            <Route path="/dashboard" element={<InvigilatorDashboard />} />
            <Route path="/register" element={<InvigilatorRegistration />} />
            <Route path="/request" element={<InvigilatorRequest />}/>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
           </div>
        )};
      </div>
    </>
  );
}

export default App;
