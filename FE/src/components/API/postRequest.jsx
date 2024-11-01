
import axios from "axios";

export const postRequest = async (data) => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = "/requests";

  try {
    const response = await axios.post(`${API_URL}${path}`, data, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return response.status === 201;
  } catch (e) {
    throw new Error(
      e.response?.data?.message || "Error registering for slots."
    );
  }

};
