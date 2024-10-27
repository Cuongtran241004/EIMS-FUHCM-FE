import axios from "axios";

export const cancellableSlotList = async (semesterId) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const path = `/invigilators/cancel?semesterId=${semesterId}`;
    try {
        const response = await axios.get(`${API_URL}${path}`, {
        withCredentials: true,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        });
    
        return response.data;
    } catch (e) {
        throw new Error(
        e.response?.data?.message || "Error fetching cancellable slots."
        );
    }
    };