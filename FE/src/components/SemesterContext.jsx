import React, { createContext, useState, useEffect, useContext } from "react";
import { useFetchSemesters } from "./Hook/useFetchSemesters";
import { useFetchAvailableSlots } from "./Hook/useFetchAvailableSlots";
import { useSemesterConfig } from "./Hook/useSemesterConfig";
import moment from "moment";
import { useInviReport } from "./Hook/useInviReport";
import { useFetchSchedules } from "./Hook/useFetchSchedules";
import { useInviAttendance } from "./Hook/useInviAttendance";
import { useRegisterSlots } from "./Hook/useRegisterSlots";


const SemesterContext = createContext();

export const useSemester = () => useContext(SemesterContext);

export const SemesterProviderInvigilator = ({ children }) => {
  const { semesters, loading: loadingSemesters } = useFetchSemesters();
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [lastestSemester, setLasestSemester] = useState(null);
  const [reloadSlots, setReloadSlots] = useState(0);
  const { availableSlotsData, loading: loadingAvailableSlots } =
    useFetchAvailableSlots(lastestSemester?.id, reloadSlots);
  const { examSlotApproved, inviFee, loading: loadingReport } = useInviReport(
    selectedSemester?.id, reloadSlots);
  const { examSlotDetail, loading: loadingSchedules } = useFetchSchedules(
    selectedSemester?.id, reloadSlots);
  const {attendance, loading: loadingAttendance} = useInviAttendance(
      selectedSemester?.id, reloadSlots);
  const {examSlotRegister, loading: loadingExamSlotRegister} = useRegisterSlots(
    selectedSemester?.id, reloadSlots);

  const { semesterConfig, getConfigValue } = useSemesterConfig(lastestSemester?.id);

  useEffect(() => {
    if (semesters.length > 0) {
      const currentDate = moment();
      const currentSemester = semesters.find((semester) => moment(currentDate).isBetween(moment(semester.startAt), moment(semester.endAt)), null, '[]');
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
        loadingReport,
        loadingAttendance,
        reloadAvailableSlots,
        lastestSemester,
        setLasestSemester,
        semesterConfig,
        getConfigValue,
        examSlotApproved,
        inviFee,
        attendance,
        examSlotRegister,
      }}
    >
      {children}
    </SemesterContext.Provider>
  );
};

