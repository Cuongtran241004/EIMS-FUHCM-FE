import axios from "axios";
import { API_BASE_URL } from "../configs/urlApi.js";
const EMAIL_API_BASE_URL = `${API_BASE_URL}/email`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};

const emailApi = {
  sendEmailToInvigilators: async (semesterId, toEmails) => {
    try {
      const response = await axios.get(`${EMAIL_API_BASE_URL}`, {
        params: {
          semesterId,
          toEmails,
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
};

export default emailApi;
