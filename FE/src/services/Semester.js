import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SEMESTER_API_BASE_URL = `${API_BASE_URL}/semesters`;

const handleError = (error) => {
  console.error("Error with API request:", error);
  throw error;
};

const semesterApi = {
  getAllSemesters: async () => {
    try {
      const response = await axios.get(`${SEMESTER_API_BASE_URL}`, {
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

  getSemesterByName: async (name) => {
    try {
      const response = await axios.get(`${SEMESTER_API_BASE_URL}/${name}`, {
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

  addSemester: async (semester) => {
    try {
      const response = await axios.post(`${SEMESTER_API_BASE_URL}`, semester, {
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

  updateSemester: async (semester) => {
    try {
      console.log(semester);
      const response = await axios.put(
        `${SEMESTER_API_BASE_URL}/${semester.id}`,
        semester,
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
export default semesterApi;
