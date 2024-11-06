import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const STAFF_ATTENDANCE_API_BASE_URL = `${API_BASE_URL}/invigilator-attendance/staff`;
const MANAGER_ATTENDANCE_API_BASE_URL = `${API_BASE_URL}/invigilator-attendance/manager`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};

const attendanceApi = {
  getAllAttendanceToday: async () => {
    try {
      const response = await axios.get(
        `${STAFF_ATTENDANCE_API_BASE_URL}/today`,
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
  getAllAttendanceByDate: async () => {
    try {
      const response = await axios.get(`${STAFF_ATTENDANCE_API_BASE_URL}/day`, {
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
        `${STAFF_ATTENDANCE_API_BASE_URL}/exam-slots-by-day`,
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
  getAttendanceByExamSlotId: async (examSlotId) => {
    try {
      const response = await axios.get(
        `${STAFF_ATTENDANCE_API_BASE_URL}/exam-slot/${examSlotId}`,
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
  addAllAttendanceByDate: async (date) => {
    try {
      const response = await axios.post(
        `${STAFF_ATTENDANCE_API_BASE_URL}/add-by-day`,
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
        `${STAFF_ATTENDANCE_API_BASE_URL}/checkin-all/${checkin.examSlotId}`,
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
        `${STAFF_ATTENDANCE_API_BASE_URL}/checkin-all`,
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
        `${STAFF_ATTENDANCE_API_BASE_URL}/checkin/${checkin.id}`,
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
        `${STAFF_ATTENDANCE_API_BASE_URL}/checkout/${checkout.examSlotId}`,
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
        `${STAFF_ATTENDANCE_API_BASE_URL}/checkout/${checkout.id}`,
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
        `${STAFF_ATTENDANCE_API_BASE_URL}/checkout-all`,
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
  updateAttendanceByManager: async (attendance) => {
    try {
      const response = await axios.put(
        `${MANAGER_ATTENDANCE_API_BASE_URL}/update/${attendance.id}`,
        attendance,
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
  updateConfirmAttendanceByManager: async (examSlotId) => {
    try {
      const response = await axios.put(
        `${MANAGER_ATTENDANCE_API_BASE_URL}/approve/${examSlotId}`,
        {},
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
  getAttendanceByExamSlotIdManager: async (examSlotId) => {
    try {
      const response = await axios.get(
        `${MANAGER_ATTENDANCE_API_BASE_URL}/exam-slot/${examSlotId}`,
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
  getExamSlotByDateManager: async (date) => {
    try {
      const response = await axios.get(
        `${MANAGER_ATTENDANCE_API_BASE_URL}/exam-slots-by-day`,
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
  getExamSlotBySemesterIdManager: async (semesterId) => {
    try {
      const response = await axios.get(
        `${MANAGER_ATTENDANCE_API_BASE_URL}/exam-slot-by-semester/${semesterId}`,
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
  getAttendanceReportBySemesterIdManager: async (semesterId) => {
    try {
      const response = await axios.get(
        `${MANAGER_ATTENDANCE_API_BASE_URL}/report/invigilator/${semesterId}`,
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
