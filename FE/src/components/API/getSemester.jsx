import axios from "axios";

export const getSemester = async () => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const path = "/semesters";

    try {
        const response = await axios.get(`${API_URL}${path}`
                , {
            withCredentials: true,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }
        );
        return response.data;
    } catch (e) {
        console.error("getSemester Error: ", e.message);
        return false;
    }
}