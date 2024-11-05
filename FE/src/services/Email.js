import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
