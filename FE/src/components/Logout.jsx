import React from "react";
import { Button, message } from "antd"; // Nhập khẩu message từ antd
import axios from "axios"; // Nhập khẩu axios

function Logout() {
  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const path = "/v1/oauth/logout";

    try {
      const response = await axios.post(
        `${API_URL}${path}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("Logged out successfully");
        window.location.href = "/login";
      } else {
        message.error("Logout failed");
      }
    } catch (e) {
      console.error("Logout Error: ", e.message);
      message.error("Logout failed");
    }
    localStorage.removeItem("role");
  };

  return (
    <Button danger onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
