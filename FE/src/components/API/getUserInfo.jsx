import axios from "axios";

// Ensure cookies are sent with the request
export const getUserInfo = async () => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = "/v1/oauth/user/info";
  try {
    const response = await axios.get(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true, // Important to include credentials
    });

    return response.data;
  } catch (e) {
    console.error("getUserInfo Error: ", e.response?.data || e.message);
    return false;
  }
};
