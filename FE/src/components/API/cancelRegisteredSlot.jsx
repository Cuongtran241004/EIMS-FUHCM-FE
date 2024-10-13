import axios from "axios";

export const cancelRegisteredSlot = async (slotId) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const path = '/invigilators/myinfo/register';
    console.log(slotId);
    try {
      const response = await axios.post(`${API_URL}${path}`, slotId, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      return response.status === 201;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Error registering for slots.');
    }
};