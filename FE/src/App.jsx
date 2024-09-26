import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Staff from "./pages/Manager/Staff";
import Dashboard from "./pages/Dashboard/Dashboard";
import Request from "./pages/Request/Request";
import Invigilator from "./pages/Manager/Invigilator";
import Semester from "./pages/Manager/Semester";
import Subject from "./pages/Manager/Subject";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const expirationTime = sessionStorage.getItem("expirationTime");
    const currentTime = new Date().getTime();
    if (isLoggedIn === "true" && currentTime < expirationTime) {
      setLoggedIn(true);
    } else {
      sessionStorage.clear();
    }
  }, []);

  return (
    <>
      <div className="container">
        {!loggedIn ? (
          <Login setLoggedIn={setLoggedIn} />
        ) : (
          <div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/semesters" element={<Semester />} />
              <Route path="/subjects" element={<Subject />} />
              <Route path="/staffs" element={<Staff />} />
              <Route path="/invigilators" element={<Invigilator />} />
              <Route path="/requests" element={<Request />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
