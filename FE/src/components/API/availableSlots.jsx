
import axios from "axios";

export const availableSlots = async (semesterId) => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = "/invigilators/register/semesterid=";

  try {
    const response = await axios.get(`${API_URL}${path}${semesterId}`, {
      withCredentials: true,
      headers: {

        Accept: "application/json",
        "Content-Type": "application/json",

      },
    });
    return response.data;
  } catch (e) {

    console.error("availableSlots Error: ", e.message);
    throw new Error(
      e.response?.data?.message || "Error fetching available slots."
    );

  }
};
