import axios from "axios";

export const getInvigilatorReport = async (semesterId) => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const path = `/invigilator-attendance/invigilator/report/${semesterId}`;

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
        console.error("getSemester Error: ", e.message);
        throw new Error(e.response?.data?.message || "Error fetching semesters.");
    }
}