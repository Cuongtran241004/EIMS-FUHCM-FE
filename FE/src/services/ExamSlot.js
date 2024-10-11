import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.js";
const EXAM_SLOT_API_BASE_URL = `${API_BASE_URL}/examslots`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};

const examSlotApi = {
  getAllExamSlots: async () => {
    try {
      const response = await axios.get(`${EXAM_SLOT_API_BASE_URL}`, {
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
  getExamSlotById: async (id) => {
    try {
      const response = await axios.get(`${EXAM_SLOT_API_BASE_URL}/${id}`, {
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
  getExamSlotBySemesterId: async (semesterId, page = 1) => {
    try {
      const response = await axios.get(
        `${EXAM_SLOT_API_BASE_URL}/by-semester/${semesterId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: {
            page,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  addExamSlot: async (examSlot) => {
    try {
      const response = await axios.post(`${EXAM_SLOT_API_BASE_URL}`, examSlot, {
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
  addMultipleExamSlots: async (examSlots) => {
    try {
      const response = await axios.post(
        `${EXAM_SLOT_API_BASE_URL}/bulk`,
        examSlots,
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
  updateExamSlot: async (examSlot) => {
    try {
      const response = await axios.put(
        `${EXAM_SLOT_API_BASE_URL}/${examSlot.id}`,
        examSlot,
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
  deleteExamSlot: async (id) => {
    try {
      const response = await axios.delete(`${EXAM_SLOT_API_BASE_URL}/${id}`, {
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

export default examSlotApi;
