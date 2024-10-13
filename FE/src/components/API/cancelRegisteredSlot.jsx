import axios from 'axios';

export const cancelRegisteredSlot = async (slotId) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
   
   const slotIds = Array.isArray(slotId) ? slotId : [slotId];

   const queryString = slotIds.map(id => `id=${id}`).join('&'); 
   const path = `/invigilators/myinfo/register?${queryString}`;
    console.log(slotId);
    try {
      const response = await axios.delete(`${API_URL}${path}`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      return response.status === 200;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Error registering for slots.');
    }
};