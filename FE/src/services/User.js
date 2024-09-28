import axios from "axios";
import { API_BASE_URL } from "../configs/keys";
const USER_API_BASE_URL = `${API_BASE_URL}/users`;
// CUSTOM AXIOS INSTANCE
// const USER_API = axios.create({
//   baseURL: USER_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
const userApi = {
  getAllusers: async ({ filters = {} }) => {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  getUserByFuId: async (fuId) => {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}/${fuId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  addUser: async (user) => {
    try {
      const response = await axios.post(`${USER_API_BASE_URL}`, user);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  updateUser: async (user) => {
    try {
      const response = await axios.put(
        `${USER_API_BASE_URL}/${user.fuId}`,
        user
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  deleteUser: async (fuId) => {
    try {
      const response = await axios.delete(`${USER_API_BASE_URL}/${fuId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};

export default userApi;
