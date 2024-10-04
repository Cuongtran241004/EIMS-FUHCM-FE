import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.jsx";
const SEMESTER_API_BASE_URL = `${API_BASE_URL}/semesters`;

const handleError = (error) => {
  console.error("Error with API request:", error);
  throw error;
};

const semesterApi = {
  getAllSemesters: async ({ filters = {} }) => {
    try {
      const response = await axios.get(`${SEMESTER_API_BASE_URL}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getSemesterById: async (id) => {
    try {
      const response = await axios.get(`${SEMESTER_API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  addSemester: async (semester) => {
    try {
      const response = await axios.post(`${SEMESTER_API_BASE_URL}`, semester);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateSemester: async (semester) => {
    try {
      const response = await axios.put(
        `${SEMESTER_API_BASE_URL}/${semester.id}`,
        semester
      );
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  //   deleteSemester: async (code) => {
  //     try {
  //       const response = await axios.delete(`${SEMESTER_API_BASE_URL}/${code}`);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       throw error;
  //     }
  //   },
};
export default semesterApi;
