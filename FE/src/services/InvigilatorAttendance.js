import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.js";
const ATTENDANCE_API_BASE_URL = `${API_BASE_URL}/invigilator-attendance`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};

const attendanceApi = {
  getAllAttendance: async () => {
    try {
      const response = await axios.get(`${ATTENDANCE_API_BASE_URL}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getAllAttendanceToday: async () => {
    try {
      const response = await axios.get(`${ATTENDANCE_API_BASE_URL}/today`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getAllAttendanceByDate: async () => {
    try {
      const response = await axios.get(`${ATTENDANCE_API_BASE_URL}/day`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateCheckinAll: async (checkin) => {
    try {
      const response = await axios.put(
        `${ATTENDANCE_API_BASE_URL}/checkin-all/${checkin.id}`,
        checkin,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};
