import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.js";
const CONFIG_API_BASE_URL = `${API_BASE_URL}/config`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};
const configApi = {
  getAllConfigs: async () => {
    try {
      const response = await axios.get(`${CONFIG_API_BASE_URL}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateConfig: async (config) => {
    try {
      const response = await axios.put(`${CONFIG_API_BASE_URL}`, config);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default configApi;
