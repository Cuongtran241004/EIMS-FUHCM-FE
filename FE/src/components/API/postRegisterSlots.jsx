
import axios from "axios";

export const postRegisterSlots = async (slots) => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = "/invigilators";

  try {
    const response = await axios.post(`${API_URL}${path}`, slots, {
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
