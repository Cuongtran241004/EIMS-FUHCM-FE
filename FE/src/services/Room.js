import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.jsx";
const ROOM_API_BASE_URL = `${API_BASE_URL}/rooms`;

const roomApi = {
  getAllRooms: async ({ filters = {} }) => {
    try {
      const response = await axios.get(`${ROOM_API_BASE_URL}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  getRoomByName: async (name) => {
    try {
      const response = await axios.get(`${ROOM_API_BASE_URL}/${name}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  addRoom: async (room) => {
    try {
      const response = await axios.post(`${ROOM_API_BASE_URL}`, room);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  updateRoom: async (room) => {
    try {
      const response = await axios.put(`${ROOM_API_BASE_URL}/${room.id}`, room);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  //   deleteRoom: async (code) => {
  //     try {
  //       const response = await axios.delete(`${ROOM_API_BASE_URL}/${code}`);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       throw error;
  //     }
  //   },
};

export default roomApi;
