import axios from "axios";

export const getSemesterConfig = async (semesterId) => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = `/configs/semester/${semesterId}`;

  try {
    const response = await axios.get(`${API_URL}${path}`, {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return false;
  }
};