import { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Staff from "./pages/Manager/Staff";

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
              <Route path="/staffs" element={<Staff />} />
            </Routes>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
