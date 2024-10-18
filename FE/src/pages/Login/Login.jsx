import React, { useContext, useState } from "react";
import { UserContext } from "../../components/UserContext";
import GoogleLogin from "../../components/API/GoogleLogin";
import { postLoginToken } from "../../components/API/postLoginToken";
import { postEmail } from "../../components/API/postEmail";
import "./Login.css";
import LoginForm from "./LoginForm";
import { getUserInfo } from "../../components/API/getUserInfo";

export default function Login({ setIsLogin }) {
  const { setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");

  const onLoginForm = async (values) => {
    const result = await postEmail(values);
    if (result) {
      const initInfo = await getUserInfo();
      if (initInfo) {
        const userInfo = {
          role: initInfo.role,
          firstName: initInfo.firstName,
          lastName: initInfo.lastName,
        };
        localStorage.setItem("role", userInfo.role);
        localStorage.setItem("firstName", userInfo.firstName);
        localStorage.setItem("lastName", userInfo.lastName);

        setUser(userInfo);
        setIsLogin(true);
        window.location.reload();
      }
    } else {
      setErrorMessage1("Wrong email or password.");
    }
  };

  const onGoogleSignIn = async (res) => {
    const { credential } = res;
    const result = await postLoginToken(credential);
    if (result) {
      const initInfo = await getUserInfo();
      if (initInfo) {
        const userInfo = {
          role: initInfo.role,
          firstName: initInfo.firstName,
          lastName: initInfo.lastName,
        };

        localStorage.setItem("role", userInfo.role);
        localStorage.setItem("firstName", userInfo.firstName);
        localStorage.setItem("lastName", userInfo.lastName);

        setUser(userInfo);
        setIsLogin(true);
        window.location.reload();
      }
    } else {
      setErrorMessage("You don't have permission to access.");
      return;
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-h1">Login</h1>
        <div className="login-form-section">
          <div className="form-section">
            <LoginForm onLoginForm={onLoginForm} />
            {errorMessage1 && <p style={{ color: 'red', marginLeft: 50 }} className="error-message">{errorMessage1}</p>}
          </div>
          <div className="divider"></div>
          <div className="form-section">
            <GoogleLogin
              onGoogleSignIn={onGoogleSignIn}
              text="Login with Google"
            />
            {errorMessage && <p style={{ color: 'red' }} className="error-message">{errorMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
