import React from "react";
import { Button, message } from "antd"; 
import axios from "axios"; 

function Logout() {
  const handleLogout = async () => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const path = 'v1/oauth/logout';

    try {
        const response = await axios.post(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            withCredentials: true, 
        });

        
        return response.data;
    } catch (e) {
        console.error('Error: ', e.message);
        return false;
    }
  };

  return (
    <Button danger onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
