
import { useEffect, useState } from "react";
import { getInvigilatorAttendance } from "../API/getInvigilatorAttendance";


export function useInviAttendance(selectedSemester, reloadSlots) {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (!selectedSemester) return;

    const fetchSchedules = async () => {
      try {
        const response = await getInvigilatorAttendance(selectedSemester);
        const attendanceList = response;
        setAttendance(attendanceList);
      } catch (e) {
        console.error("fetchSchedules Error: ", e.message);
      }
    };

    fetchSchedules();
  }, [selectedSemester, reloadSlots]);

  return { attendance };
}
 