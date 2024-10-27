import { useEffect, useState } from "react";
import { getRegisterSlots } from "../API/getRegisterSlots";


export const useRegisterSlots = (selectedSemester, reloadSlots) => {
  const [examSlotRegister, setExamSlotRegister] = useState([]);

  useEffect(() => {
    if (!selectedSemester) return;

    const fetchSchedules = async () => {
      try {
        const response = await getRegisterSlots(selectedSemester);
        const examSlotDetailSet =
          response.semesterInvigilatorRegistration;
          setExamSlotRegister(examSlotDetailSet[0].examSlotDetailSet);
      } catch (e) {
        console.error("fetchSchedules Error: ", e.message);
      }
    };

    fetchSchedules();
  }, [selectedSemester, reloadSlots]);

  return { examSlotRegister };
}