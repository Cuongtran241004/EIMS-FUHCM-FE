import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EXAM_SLOT_HALL_API_BASE_URL = `${API_BASE_URL}/examslothalls`;

const handleError = (error) => {
  console.error("Error fetching data:", error);
  throw error;
};
const examSlotHallApi = {
  getAllExamSlotHalls: async () => {
    try {
      const response = await axios.get(`${EXAM_SLOT_HALL_API_BASE_URL}`, {
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
  addExamSlotHall: async (examSlotHall) => {
    try {
      const response = await axios.post(
        `${EXAM_SLOT_HALL_API_BASE_URL}`,
        examSlotHall,
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
  updateExamSlotHall: async (examSlotHall) => {
    try {
      const response = await axios.put(
        `${EXAM_SLOT_HALL_API_BASE_URL}`,
        examSlotHall,
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
export default examSlotHallApi;
