import { useState, useEffect } from "react";
import { getSemester } from "../API/getSemester";

export function useFetchSemesters() {
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const response = await getSemester();
        setSemesters(response);
      } catch (e) {
        console.error("getSemester Error: ", e.message);
      }
    };
    fetchSemester();
  }, []);

  return { semesters };
}
