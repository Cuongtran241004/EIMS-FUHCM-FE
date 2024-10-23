import { useEffect, useState } from "react";
import { getInvigilatorAttendance } from "../API/getInvigilatorAttendance";

export function useInviAttendance(selectedSemester, reloadSlots) {
  const [examSlotDetail, setExamSlotDetail] = useState([]);
  const [inviFee, setInviFee] = useState({});

  useEffect(() => {
    if (!selectedSemester) return;

    const fetchSchedules = async () => {
      try {
        const response = await getInvigilatorAttendance(selectedSemester);

        
        const attendanceList = response.invigilatorAttendanceList;
        setExamSlotDetail(attendanceList);

        
        const feeDetails = {
          hourlyRate: response.hourlyRate,
          totalHours: response.totalHours,
          preCalculatedInvigilatorFree: response.preCalculatedInvigilatorFree,
        };
        setInviFee(feeDetails);
        
      } catch (e) {
        console.error("fetchSchedules Error: ", e.message);
      }
    };

    fetchSchedules();
  }, [selectedSemester, reloadSlots]);

  return { examSlotDetail, inviFee };
}
