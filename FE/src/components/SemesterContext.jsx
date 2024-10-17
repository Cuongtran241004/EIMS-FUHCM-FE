import React, { createContext, useState, useEffect, useContext } from "react";
import { useFetchSemesters } from "./Hook/useFetchSemesters";
import { useFetchAvailableSlots } from "./Hook/useFetchAvailableSlots";
import { useFetchSchedules } from "./Hook/useFetchSchedules";

const SemesterContext = createContext();

export const useSemester = () => useContext(SemesterContext);

export const SemesterProviderInvigilator = ({ children }) => {
  const { semesters, loading: loadingSemesters } = useFetchSemesters();
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [lastestSemester, setLasestSemester] = useState(null);
  const [reloadSlots, setReloadSlots] = useState(0);
  const { availableSlotsData, loading: loadingAvailableSlots } =
    useFetchAvailableSlots(lastestSemester?.id, reloadSlots);
  const { examSlotDetail, loading: loadingSchedules } = useFetchSchedules(
    selectedSemester?.id, reloadSlots
  );

  useEffect(() => {
    if (semesters.length > 0) {
      const select = semesters.reduce(
        (latest, current) => (current.id > latest.id ? current : latest),
        semesters[0]
      );
      setSelectedSemester(select);
    }
  }, [semesters]);

  useEffect(() => {
    if (semesters.length > 0) {
      const select = semesters.reduce(
        (latest, current) => (current.startAt != latest.startAt ? current : latest),
        semesters[0]
      );
      setLasestSemester(select);
      
    }
  },[semesters])

  const reloadAvailableSlots = () => {
    setReloadSlots(reloadSlots + 1);
  };

  return (
    <SemesterContext.Provider
      value={{
        semesters,
        selectedSemester,
        setSelectedSemester,
        availableSlotsData,
        examSlotDetail,
        loadingSemesters,
        loadingAvailableSlots,
        loadingSchedules,
        reloadAvailableSlots,
        lastestSemester,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};
