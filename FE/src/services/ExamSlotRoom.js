import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.js";
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
  getAllExamSlotRoomsById: async (id) => {
    try {
      const response = await axios.get(`${EXAM_SLOT_ROOM_API_BASE_URL}/${id}`, {
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

  addExamSlotRoom: async (examSlotRoom) => {
    try {
      const response = await axios.post(
        `${EXAM_SLOT_ROOM_API_BASE_URL}`,
        examSlotRoom,
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
