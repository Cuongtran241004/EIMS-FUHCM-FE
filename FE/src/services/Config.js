import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const CONFIG_API_BASE_URL = `${API_BASE_URL}/configs`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};
const configApi = {
  getAllConfigs: async () => {
    try {
      const response = await axios.get(`${CONFIG_API_BASE_URL}`, {
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

  getAllConfigsBySemesterId: async (semesterId) => {
    try {
      const response = await axios.get(
        `${CONFIG_API_BASE_URL}/semester/${semesterId}`,
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

  getAllConfigsLatestSemester: async () => {
    try {
      const response = await axios.get(
        `${CONFIG_API_BASE_URL}/latest-semester`,
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

  updateConfig: async (config) => {
    try {
      const response = await axios.put(
        `${CONFIG_API_BASE_URL}/${config.id}`,
        config,
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

export default configApi;
