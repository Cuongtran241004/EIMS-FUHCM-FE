import React from "react";
import { Button } from "antd";

function Logout() {
  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("expirationTime");
    sessionStorage.clear();

    window.location.reload();
  };

  return (
    <Button danger onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
