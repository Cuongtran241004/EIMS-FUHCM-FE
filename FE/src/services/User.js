import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.jsx";
const USER_API_BASE_URL = `${API_BASE_URL}/users`;

const handleError = (error) => {
  console.error("Error with API request:", error);
  throw error;
};

const userApi = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}`, {
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
  getUserByFuId: async (fuId) => {
    try {
      const response = await axios.get(`${USER_API_BASE_URL}/${fuId}`, {
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

  addUser: async (user) => {
    try {
      const response = await axios.post(`${USER_API_BASE_URL}`, user, {
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
  updateUser: async (user) => {
    try {
      console.log(user.fuId);
      const response = await axios.put(
        `${USER_API_BASE_URL}/${user.fuId}`,
        user,
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
  deleteUser: async (fuId) => {
    try {
      const response = await axios.delete(`${USER_API_BASE_URL}/${fuId}`, {
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
};

export default userApi;
