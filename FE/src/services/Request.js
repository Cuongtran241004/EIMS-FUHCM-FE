import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.js";
const REQUEST_API_BASE_URL = `${API_BASE_URL}/requests`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};
const requestApi = {
  getAllRequestsBySemesterId: async (semesterId) => {
    try {
      const response = await axios.get(
        `${REQUEST_API_BASE_URL}/semesterid=${semesterId}`,
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
  getAllRequestsByInvigilatorId: async (id) => {
    try {
      const response = await axios.get(
        `${REQUEST_API_BASE_URL}/invigilatorid=${id}`,
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
  getRequestById: async () => {
    try {
      const response = await axios.get(
        `${REQUEST_API_BASE_URL}/requestid=${id}`,
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
  addRequest: async (request) => {
    try {
      const response = await axios.post(`${REQUEST_API_BASE_URL}`, request, {
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
  updateRequestStatus: async (request) => {
    try {
      const response = await axios.put(
        `${REQUEST_API_BASE_URL}/requestid=${request.id}`,
        request,
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
export default requestApi;
