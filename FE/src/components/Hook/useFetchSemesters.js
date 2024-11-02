import { useState, useEffect, useContext } from "react";
import { getSemester } from "../API/getSemester";
import { UserContext } from "../UserContext";

export function useFetchSemesters() {
  const [semesters, setSemesters] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchSemester = async () => {
      const role = user.role;
      if (role !== null) {
      try {
        const response = await getSemester();
        setSemesters(response);
      } catch (e) {
        console.error("getSemester Error: ", e.message);
      }
    };
  }
  fetchSemester();
  }, [user]);
  return { semesters };
}
