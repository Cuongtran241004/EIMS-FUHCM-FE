import React, { useContext } from "react";
import { UserContext } from "../../components/UserContext";
import GoogleLogin from "../../components/API/GoogleLogin";
import { postLoginToken } from "../../components/api/postLoginToken";
import "./Login.css";
import LoginForm from "./LoginForm";
import { getUserInfo } from "../../components/API/getUserInfo";

export default function Login({ setIsLogin }) {
  const { setUser } = useContext(UserContext);

  const onGoogleSignIn = async (res) => {
    const { credential } = res;
    const result = await postLoginToken(credential);
    if (result) {
      const initInfo = await getUserInfo();
      if (initInfo) {
        const userInfo = {
          role: initInfo.role.name,
          firstName: initInfo.firstName,
          lastName: initInfo.lastName,
        };
        // Save user information to localStorage
        localStorage.setItem("role", userInfo.role);
        localStorage.setItem("firstName", userInfo.firstName);
        localStorage.setItem("lastName", userInfo.lastName);

        // Set user information in context
        setUser(userInfo);
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-h1">Login</h1>
        <div className="login-form-section">
          <div className="form-section">
            <LoginForm />
          </div>
          <div className="divider"></div>
          <div className="form-section">
            <GoogleLogin
              onGoogleSignIn={onGoogleSignIn}
              text="Login with Google"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
