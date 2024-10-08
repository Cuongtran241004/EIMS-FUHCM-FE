import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.jsx";
const ROOM_API_BASE_URL = `${API_BASE_URL}/rooms`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};
const roomApi = {
  getAllRooms: async () => {
    try {
      const response = await axios.get(`${ROOM_API_BASE_URL}`, {
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
  getRoomById: async (id) => {
    try {
      const response = await axios.get(`${ROOM_API_BASE_URL}/${id}`, {
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
  addRoom: async (room) => {
    try {
      const response = await axios.post(`${ROOM_API_BASE_URL}`, room, {
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
  updateRoom: async (room) => {
    try {
      const response = await axios.put(
        `${ROOM_API_BASE_URL}/${room.id}`,
        room,
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

export default roomApi;
