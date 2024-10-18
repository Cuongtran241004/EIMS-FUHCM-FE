import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.js";
const INVIGILATOR_ASSIGNMENT_API_BASE_URL = `${API_BASE_URL}/assignment`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};
const invigilatorAssignmentApi = {
  getAllAssignmentByExamSlotId: async (examSlotId) => {
    try {
      const response = await axios.get(
        `${INVIGILATOR_ASSIGNMENT_API_BASE_URL}`,
        {
          params: {
            examSlotId,
          },
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
  getAssignmentById: async (id) => {
    try {
      const response = await axios.get(
        `${INVIGILATOR_ASSIGNMENT_API_BASE_URL}/assignmentid=${id}`,
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

  updateAssignment: async (data) => {
    try {
      const response = await axios.put(
        `${INVIGILATOR_ASSIGNMENT_API_BASE_URL}/update`,
        data,
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

export default invigilatorAssignmentApi;
