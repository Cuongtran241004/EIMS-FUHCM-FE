import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const EXAM_SLOT_ROOM_API_BASE_URL = `${API_BASE_URL}/examslotrooms`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};

const examSlotRoomApi = {
  getAllExamSlotRooms: async () => {
    try {
      const response = await axios.get(`${EXAM_SLOT_ROOM_API_BASE_URL}`, {
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

  getUnavailableRooms: async (startAt, endAt) => {
    try {
      const response = await axios.get(
        `${EXAM_SLOT_ROOM_API_BASE_URL}/unavailable-rooms`,
        {
          params: {
            startAt, // Should be a string in correct date-time format
            endAt, // Should be a string in correct date-time format
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
      console.error("Error fetching unavailable rooms:", error);
      // Optional: Handle specific error cases based on the response
      handleError(error);
    }
  },

  getRoomTodayByExamSlotId: async (examSlotId) => {
    try {
      const response = await axios.get(
        `${EXAM_SLOT_ROOM_API_BASE_URL}/dashboard/exam-slot/${examSlotId}`,
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

export default examSlotRoomApi;
