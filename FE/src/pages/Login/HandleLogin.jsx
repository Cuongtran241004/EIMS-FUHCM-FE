import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { Tag } from "antd";
import { BACKEND_API_URL } from "../../configs/keys";
import { LOGIN_FAILED } from "../../configs/messages";

function HandleLogin({ setLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState("");

  // Handle successful login from Google
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      const userEmail = payload.email;
      const expirationTime = new Date().getTime() + 60 * 30 * 1000;


      const response = await axios.post(`${BACKEND_API_URL}/oauth2/code/google`, {
        token
      },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
      console.log("Response from Backend:", response);
      console.log("Response status:", response.status);

      if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("expirationTime", expirationTime.toString());
        sessionStorage.setItem("authToken", token);
        setLoggedIn(true);
        setErrorMessage("");
      } else {
        setErrorMessage(LOGIN_FAILED);
      }
    } catch (error) {
      console.error("Error during login process:", error);
      setErrorMessage(LOGIN_FAILED);
    }
  };

  const handleLoginError = () => {
    setErrorMessage(LOGIN_FAILED);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
      {errorMessage && (
        <Tag color="red" style={{ fontSize: "15px", margin: "20px auto" }}>
          {errorMessage}
        </Tag>
      )}
    </div>
  );
}

export default HandleLogin;
