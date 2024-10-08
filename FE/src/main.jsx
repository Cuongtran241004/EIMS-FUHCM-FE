import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { UserProvider } from "./components/API/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <Router>
      <App />
    </Router>
  </UserProvider>
);
