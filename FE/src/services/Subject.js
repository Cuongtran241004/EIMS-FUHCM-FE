import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.jsx";
const SUBJECT_API_BASE_URL = `${API_BASE_URL}/subjects`;

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
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  getSubjectBySemester: async (code) => {
    try {
      const response = await axios.get(`${SUBJECT_API_BASE_URL}/${code}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
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
      console.error("Error fetching data:", error);
      throw error;
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
      console.error("Error fetching data:", error);
      throw error;
    }
  },
  deleteSubject: async (code) => {
    try {
      const response = await axios.delete(`${SUBJECT_API_BASE_URL}/${code}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },
};
export default subjectApi;
