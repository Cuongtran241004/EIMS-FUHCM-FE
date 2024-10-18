import axios from "axios";

export const schedules = async (semesterId) => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = "/invigilators/myinfo/semesterid=";
  const response = await axios.get(`${API_URL}${path}${semesterId}`, {
    withCredentials: true,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
