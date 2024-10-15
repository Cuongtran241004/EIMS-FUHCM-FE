import React, { createContext, useState, useEffect, useContext } from "react";
import { useFetchSemesters } from "./Hook/useFetchSemesters";
import { useFetchAvailableSlots } from "./Hook/useFetchAvailableSlots";
import { useFetchSchedules } from "./Hook/useFetchSchedules";

const SemesterContext = createContext();

export const useSemester = () => useContext(SemesterContext);

export const SemesterProviderInvigilator = ({ children }) => {
  const { semesters, loading: loadingSemesters } = useFetchSemesters();
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [reloadSlots, setReloadSlots] = useState(0);
  const { availableSlotsData, loading: loadingAvailableSlots } =
    useFetchAvailableSlots(selectedSemester?.id, reloadSlots);
  const { examSlotDetail, loading: loadingSchedules } = useFetchSchedules(
    selectedSemester?.id, reloadSlots
  );

  useEffect(() => {
    if (semesters.length > 0) {
      const latestSemester = semesters.reduce(
        (latest, current) => (current.id > latest.id ? current : latest),
        semesters[0]
      );
      setSelectedSemester(latestSemester);
    }
  }, [semesters, availableSlotsData]);

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
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};
