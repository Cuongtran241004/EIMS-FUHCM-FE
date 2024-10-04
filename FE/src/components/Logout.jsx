import React from "react";
import { Button, message } from "antd";
import axios from "axios";

function Logout() {
    const handleLogout = async () => {
        const API_URL = import.meta.env.VITE_APP_API_URL;
        const path = '/v1/oauth/logout';

        try {
            const response = await axios.post(
                `${API_URL}${path}`,
                {}, // No body required for logout
                {
                    withCredentials: true, // Send cookies to the backend for deletion
                   

                }
            );

            if (response.status === 200) {
                message.success("Logout successful!");

                // Optionally redirect the user to a login or home page after logout
                window.location.href = "/login";
            }
        } catch (error) {
            console.error('Logout error:', error.message);
            message.error("Logout failed. Please try again.");
        }
    };

    return (
        <Button danger onClick={handleLogout}>
            Logout
        </Button>
    );
}

export default Logout;