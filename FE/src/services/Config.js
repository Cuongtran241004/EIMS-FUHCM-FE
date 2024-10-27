import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.js";
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
  getTimeBeforeExam: async () => {
    try {
      const response = await axios.get(
        `${CONFIG_API_BASE_URL}/time-before-exam`,
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
  getInvigilatorRoom: async () => {
    try {
      const response = await axios.get(
        `${CONFIG_API_BASE_URL}/invigilator-room`,
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
  getHourlyRate: async () => {
    try {
      const response = await axios.get(`${CONFIG_API_BASE_URL}/hourly-rate`, {
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
  getAllowedSlot: async () => {
    try {
      const response = await axios.get(`${CONFIG_API_BASE_URL}/allowed-slot`, {
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
  getTimeBeforeOpenRegistration: async () => {
    try {
      const response = await axios.get(
        `${CONFIG_API_BASE_URL}/time-before-open-registration`,
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
  getTimeBeforeCloseRequest: async () => {
    try {
      const response = await axios.get(
        `${CONFIG_API_BASE_URL}/time-before-close-request`,
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
  getTimeBeforeCloseRegistration: async () => {
    try {
      const response = await axios.get(
        `${CONFIG_API_BASE_URL}/time-before-close-registration`,
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

  getAllConfigsBySemester: async (semesterId) => {
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
  addTimeBeforeExam: async (timeBeforeExam) => {
    try {
      const response = await axios.post(
        `${CONFIG_API_BASE_URL}/time-before-exam`,
        timeBeforeExam,
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
  addInvigilatorRoom: async (invigilatorRoom) => {
    try {
      const response = await axios.post(
        `${CONFIG_API_BASE_URL}/invigilator-room`,
        invigilatorRoom,
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
  addHourlyRate: async (hourlyRate) => {
    try {
      const response = await axios.post(
        `${CONFIG_API_BASE_URL}/hourly-rate`,
        hourlyRate,
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
  addAllowedSlot: async (allowedSlot) => {
    try {
      const response = await axios.post(
        `${CONFIG_API_BASE_URL}/allowed-slot`,
        allowedSlot,
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
  addTimeBeforeOpenRegistration: async (timeBeforeOpenRegistration) => {
    try {
      const response = await axios.post(
        `${CONFIG_API_BASE_URL}/time-before-open-registration`,
        timeBeforeOpenRegistration,
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
  addTimeBeforeCloseRequest: async (timeBeforeCloseRequest) => {
    try {
      const response = await axios.post(
        `${CONFIG_API_BASE_URL}/time-before-close-request`,
        timeBeforeCloseRequest,
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
  addTimeBeforeCloseRegistration: async (timeBeforeCloseRegistration) => {
    try {
      const response = await axios.post(
        `${CONFIG_API_BASE_URL}/time-before-close-registration`,
        timeBeforeCloseRegistration,
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
  addMultipleConfigs: async (configs) => {
    try {
      const response = await axios.post(
        `${CONFIG_API_BASE_URL}/bulk`,
        configs,
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
