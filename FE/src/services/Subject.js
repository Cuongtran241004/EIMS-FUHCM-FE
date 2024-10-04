import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.jsx";
const SUBJECT_API_BASE_URL = `${API_BASE_URL}/subjects`;

const subjectApi = {
  getAllSubjects: async ({ filters = {} }) => {
    try {
      const response = await axios.get(`${SUBJECT_API_BASE_URL}`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  getSubjectByCode: async (code) => {
    try {
      const response = await axios.get(`${SUBJECT_API_BASE_URL}/${code}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  addSubject: async (subject) => {
    try {
      const response = await axios.post(`${SUBJECT_API_BASE_URL}`, subject);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  updateSubject: async (subject) => {
    try {
      const response = await axios.put(
        `${SUBJECT_API_BASE_URL}/${subject.code}`,
        subject
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  //   deleteSubject: async (code) => {
  //     try {
  //       const response = await axios.delete(`${SUBJECT_API_BASE_URL}/${code}`);
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       throw error;
  //     }
  //   },
};
export default subjectApi;
