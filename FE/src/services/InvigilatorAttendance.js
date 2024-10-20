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
          Accept: "application/json",
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
          Accept: "application/json",
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
          Accept: "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getExamSlotByDate: async (date) => {
    try {
      const response = await axios.get(
        `${ATTENDANCE_API_BASE_URL}/exam-slots-by-day`,
        {
          params: {
            date,
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  addAllAttendanceByDate: async (date) => {
    try {
      const response = await axios.post(
        `${ATTENDANCE_API_BASE_URL}/add-by-day`,
        {},
        {
          params: {
            date,
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateCheckinAllByExamSlotId: async (checkin) => {
    try {
      const response = await axios.put(
        `${ATTENDANCE_API_BASE_URL}/checkin-all/${checkin.examSlotId}`,
        checkin,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateCheckinList: async (checkin) => {
    try {
      const response = await axios.put(
        `${ATTENDANCE_API_BASE_URL}/checkin-all`,
        checkin,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateCheckinById: async (checkin) => {
    try {
      const response = await axios.put(
        `${ATTENDANCE_API_BASE_URL}/checkin/${checkin.id}`,
        checkin,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateCheckoutByExamSlotId: async (checkout) => {
    try {
      const response = await axios.put(
        `${ATTENDANCE_API_BASE_URL}/checkout/${checkout.examSlotId}`,
        checkout,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateCheckoutById: async (checkout) => {
    try {
      const response = await axios.put(
        `${ATTENDANCE_API_BASE_URL}/checkout/${checkout.id}`,
        checkout,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateCheckoutList: async (checkout) => {
    try {
      const response = await axios.put(
        `${ATTENDANCE_API_BASE_URL}/checkout-all`,
        checkout,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
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

export default attendanceApi;
