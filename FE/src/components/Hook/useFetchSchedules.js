import { useState, useEffect } from "react";
import { schedules } from "../API/schedules";

export function useFetchSchedules(selectedSemester, reloadSlots) {
  const [examSlotDetail, setExamSlotDetail] = useState([]);

  useEffect(() => {
    if (!selectedSemester) return;

    const fetchSchedules = async () => {
      try {
        const response = await schedules(selectedSemester);
        const examSlotDetailSet = response;
        const mappedEvents = examSlotDetailSet.map((slot) => ({
          examSlotId: slot.examSlotId,
          startAt: new Date(slot.startAt),
          endAt: new Date(slot.endAt),
        }));
        setExamSlotDetail(mappedEvents);
      } catch (e) {
        console.error("fetchSchedules Error: ", e.message);
      }
    };

    fetchSchedules();
  }, [selectedSemester, reloadSlots]);

  return { examSlotDetail };
}
