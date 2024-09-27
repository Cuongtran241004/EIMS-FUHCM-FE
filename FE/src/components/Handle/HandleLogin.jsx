import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import axios from "axios";
import { Tag } from "antd";
import { CLIENT_ID } from "../../configs/keys";
import { LOGIN_FAILED, LOGIN_NOT_ALLOW } from "../../configs/messages";

function HandleLogin({ setLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [allowedEmails, setAllowedEmails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(CLIENT_ID);
        setAllowedEmails(response.data.map((login) => login.email));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          // Lấy token từ phản hồi
          const token = credentialResponse.credential;
          // Giải mã JWT để lấy thông tin người dùng
          const payload = JSON.parse(atob(token.split(".")[1]));

          // Lấy email của người dùng từ token
          const userEmail = payload.email;
          // Duy trì đăng nhập trong 1 tiếng
          const expirationTime = new Date().getTime() + 60 * 60 * 1000;
          // Kiểm tra email có trong danh sách allowedEmails không
          if (allowedEmails.includes(userEmail)) {
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userEmail", userEmail);
            sessionStorage.setItem("expirationTime", expirationTime);
            setLoggedIn(true);
            setErrorMessage("");
            console.log(token);
            console.log(payload);
          } else {
            setErrorMessage(LOGIN_NOT_ALLOW);
          }
        }}
        onError={() => {
          errorMessage(LOGIN_FAILED);
        }}
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
