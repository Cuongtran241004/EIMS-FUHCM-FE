import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SUBJECT_API_BASE_URL = `${API_BASE_URL}/subjects`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};

const subjectApi = {
  getAllSubjects: async () => {
    try {
      const response = await axios.get(`${SUBJECT_API_BASE_URL}`, {
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

  getSubjectBySemester: async (semesterId) => {
    try {
      const response = await axios.get(
        `${SUBJECT_API_BASE_URL}/by-semester/${semesterId}`,
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

  addSubject: async (subject) => {
    try {
      const response = await axios.post(`${SUBJECT_API_BASE_URL}`, subject, {
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

  updateSubject: async (subject) => {
    try {
      const response = await axios.put(
        `${SUBJECT_API_BASE_URL}/${subject.id}`,
        subject,
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

  deleteSubject: async (id) => {
    try {
      const response = await axios.delete(`${SUBJECT_API_BASE_URL}/${id}`, {
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
export default subjectApi;
