import axios from "axios";

export const postRegisterSlots = async (slots) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const path = "/invigilators";

    try {
        const response = await axios.post(
            `${API_URL}${path}`,
            slots, // Send the slots directly as the body
            {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }
            }
        );

        // If the request is successful, Axios will return a response object
        return response.status === 200; // Check for success by the status code
    } catch (e) {
        console.error("postRegisterSlots Error: ", e.message);
        return false;
    }
}
