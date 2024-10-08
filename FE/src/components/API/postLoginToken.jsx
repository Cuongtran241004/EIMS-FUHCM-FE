import axios from "axios";

export const postLoginToken = async (idToken) => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = "/v1/oauth/login";

  try {
    const response = await axios.post(
      `${API_URL}${path}`,
      { idToken: idToken }, // Sending the Google ID token in the request body
      {
        withCredentials: true, // Include cookies in the request for cross-origin requests
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Login successful, cookie should be set automatically by the browser
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Login error:", error.message);
    return false;
  }
};
