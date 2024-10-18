
import axios from "axios";

export async function postHandlePassword(data) {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = "/v1/oauth/add-password";

  try {
    const response = await axios.post(`${API_URL}${path}`, data, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Login error:", error.message);
    return false;
  }
}