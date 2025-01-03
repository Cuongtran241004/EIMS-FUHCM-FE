import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
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

  getRoomByName: async (name) => {
    try {
      const response = await axios.get(`${ROOM_API_BASE_URL}/${name}`, {
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
