import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
  getUnassignedInvigilatorByExamSlotId: async (examSlotId) => {
    try {
      const response = await axios.get(
        `${INVIGILATOR_ASSIGNMENT_API_BASE_URL}/unassigned/invigilators/examslotid=${examSlotId}`,
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
  getAssignedInvigilatorByExamSlotId: async (examSlotId) => {
    try {
      const response = await axios.get(
        `${INVIGILATOR_ASSIGNMENT_API_BASE_URL}/assigned/invigilators/examslotid=${examSlotId}`,
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
  getExamSlotWithStatus: async (semesterid) => {
    try {
      const response = await axios.get(
        `${INVIGILATOR_ASSIGNMENT_API_BASE_URL}/examslots/semesterid=${semesterid}`,
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
