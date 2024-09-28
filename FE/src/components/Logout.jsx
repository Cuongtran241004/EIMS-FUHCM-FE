import React from "react";
import { Button } from "antd";

function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("expirationTime");
    localStorage.removeItem("authToken");

    window.location.reload();
  };

  return (
    <Button danger onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
