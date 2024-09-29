import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.jsx";
const USER_API_BASE_URL = `${API_BASE_URL}/users`;
// CUSTOM AXIOS INSTANCE
// const USER_API = axios.create({
//   baseURL: USER_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const handleError = (error) => {
  console.error("Error with API request:", error);
  throw error;
};

const userApi = {
  getAllusers: async ({ filters = {} }) => {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getUserByFuId: async (fuId) => {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}/${fuId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  addUser: async (user) => {
    try {
      const response = await axios.post(`${USER_API_BASE_URL}`, user);
      return response.data;
    } catch (error) {
      handleError(error);
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
      handleError(error);
    }
  },
  deleteUser: async (fuId) => {
    try {
      const response = await axios.delete(`${USER_API_BASE_URL}/${fuId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default userApi;
