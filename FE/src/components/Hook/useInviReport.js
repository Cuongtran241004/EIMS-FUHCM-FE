import { useEffect, useState } from "react";
import { getInvigilatorReport } from "../API/getInvigilatorReport";

export function useInviReport(selectedSemester, reloadSlots) {
  const [examSlotApproved, setExamSlotApproved] = useState([]);
  const [inviFee, setInviFee] = useState({});

  useEffect(() => {
    if (!selectedSemester) return;

    const fetchSchedules = async () => {
      try {
        const response = await getInvigilatorReport(selectedSemester);

        
        const attendanceList = response.invigilatorAttendanceList;
        setExamSlotApproved(attendanceList);

        
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

  return { examSlotApproved, inviFee };
}
