import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_APP_API_URL;
const EXAM_API_BASE_URL = `${API_BASE_URL}/subjectexams`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};

const examApi = {
  getAllExams: async () => {
    try {
      const response = await axios.get(`${EXAM_API_BASE_URL}`, {
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

  getExamById: async (id) => {
    try {
      const response = await axios.get(`${EXAM_API_BASE_URL}/${id}`, {
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

  getExamBySemesterId: async (semesterId) => {
    try {
      const response = await axios.get(
        `${EXAM_API_BASE_URL}/by-semester/${semesterId}`,
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

  addExam: async (exam) => {
    try {
      const response = await axios.post(`${EXAM_API_BASE_URL}`, exam, {
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

  updateExam: async (exam) => {
    try {
      const response = await axios.put(
        `${EXAM_API_BASE_URL}/${exam.id}`,
        exam,
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

  deleteExam: async (id) => {
    try {
      const response = await axios.delete(`${EXAM_API_BASE_URL}/${id}`, {
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

export default examApi;
