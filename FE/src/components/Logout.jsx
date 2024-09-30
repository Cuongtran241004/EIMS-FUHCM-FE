import React from "react";
import { Button } from "antd";

function Logout() {
  const handleLogout = () => {
  };

  return (
    <Button danger onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
