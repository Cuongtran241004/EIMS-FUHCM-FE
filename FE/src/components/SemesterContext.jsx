import React, { createContext, useState, useEffect, useContext } from 'react';
import { useFetchSemesters } from './Hook/useFetchSemesters';
import { useFetchAvailableSlots } from './Hook/useFetchAvailableSlots';
import { useFetchSchedules } from './Hook/useFetchSchedules';

const SemesterContext = createContext();

export const useSemester = () => useContext(SemesterContext);

export const SemesterProvider = ({ children }) => {
  const { semesters, loading: loadingSemesters } = useFetchSemesters();
  const [selectedSemester, setSelectedSemester] = useState(null);
  const { availableSlotsData, loading: loadingAvailableSlots } = useFetchAvailableSlots(selectedSemester?.id);
  const { examSlotDetail, loading: loadingSchedules } = useFetchSchedules(selectedSemester?.id);


  useEffect(() => {
    if (semesters.length > 0 ) {
      const latestSemester = semesters.reduce((latest, current) =>
        current.id > latest.id ? current : latest,
        semesters[0]
      );
      
      setSelectedSemester(latestSemester);
    }
  }, [semesters]);

  console.log('availableSlotsData', availableSlotsData)
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
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};
