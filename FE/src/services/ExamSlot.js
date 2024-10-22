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
  getUsingRoom: async (id) => {
    try {
      const response = await axios.get(
        `${EXAM_SLOT_API_BASE_URL}/using-rooms/${id}`,
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
  getExamSlotWithStatus: async (startAt, endAt) => {
    try {
      const response = await axios.get(`${EXAM_SLOT_API_BASE_URL}/status`, {
        params: {
          startAt,
          endAt,
        },
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
  updateExamSlotByStaff: async (examSlot) => {
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
  updateExamSlotByManager: async (examSlots) => {
    try {
      const updatePromises = examSlots.map((slot) => {
        return axios.put(
          `${EXAM_SLOT_API_BASE_URL}/manager-update/${slot.subjectExamId}`,
          {
            subjectExamId: slot.subjectExamId,
            startAt: slot.startAt,
            endAt: slot.endAt,
            requiredInvigilators: slot.requiredInvigilators,
            status: slot.status,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );
      });
      const responses = await Promise.all(updatePromises);
      return responses.map((response) => response.data);
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
