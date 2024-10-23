import React, { createContext, useState, useEffect, useContext } from "react";
import { useFetchSemesters } from "./Hook/useFetchSemesters";
import { useFetchAvailableSlots } from "./Hook/useFetchAvailableSlots";
import { useSemesterConfig } from "./Hook/useSemesterConfig";
import moment from "moment";
import { useInviAttendance } from "./Hook/useInviAttendance";

const SemesterContext = createContext();

export const useSemester = () => useContext(SemesterContext);

export const SemesterProviderInvigilator = ({ children }) => {
  const { semesters, loading: loadingSemesters } = useFetchSemesters();
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [lastestSemester, setLasestSemester] = useState(null);
  const [reloadSlots, setReloadSlots] = useState(0);
  const { availableSlotsData, loading: loadingAvailableSlots } =
    useFetchAvailableSlots(lastestSemester?.id, reloadSlots);
  const { examSlotDetail, inviFee,  loading: loadingSchedules } = useInviAttendance(
    selectedSemester?.id, reloadSlots);
  const { semesterConfig, getConfigValue } = useSemesterConfig(lastestSemester?.id);

  useEffect(() => {
    if (semesters.length > 0) {
      const currentDate = moment();
      const currentSemester = semesters.find((semester) => moment(currentDate).isBetween(moment(semester.startAt), moment(semester.endAt)));
      if (currentSemester) {
        setSelectedSemester(currentSemester);
      } else {
        const select = semesters.reduce(
          (latest, current) => (current.id > latest.id ? current : latest),
          semesters[0]
        );
        setSelectedSemester(select);
      }
    }
  }, [semesters]);

  useEffect(() => {
    if (semesters.length > 0) {
      const currentDate = moment();
      const validSemesters = semesters.filter(semesters => moment(semesters.startAt).isSameOrBefore(currentDate));
      if (validSemesters.length > 0) {
        const lastestSemester = validSemesters.reduce((last, current) => {
          return moment(current.startAt).isSameOrAfter(last.startAt) ? current : last;
        }, validSemesters[0]);

        setLasestSemester(lastestSemester);
      }
    }
  }, [semesters])

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
        setLasestSemester,
        semesterConfig,
        getConfigValue,
        inviFee,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};
