import React, { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd"; // Ensure to import message
import semesterApi from "../../services/Semester.js";
import examSlotApi from "../../services/ExamSlot.js";
import attendanceApi from "../../services/InvigilatorAttendance.js";
import moment from "moment";
import configApi from "../../services/Config.js";
import requestApi from "../../services/Request.js";
import { managerMapperUtil } from "../../utils/Mapper/ManagerMapperUtil.jsx";
// Create a context for the semester
const SemesterContext = createContext();

// Provider component to wrap around your app
export const SemesterProvider = ({ children }) => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState({
    id: null,
    name: "Select semester",
  });
  const [configSemester, setConfigSemester] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [examSlotBySemester, setExamSlotBySemester] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [count, setCount] = useState(0); //count flag

  const fetchSemesters = async () => {
    setLoading(true); // Start loading
    try {
      const result = await semesterApi.getAllSemesters();
      setSemesters(result);

      // Sort semesters by start date
      const sortedSemesters = result.sort(
        (a, b) => new Date(b.startAt) - new Date(a.startAt)
      );

      // Set default semester to the latest one, if it exists
      if (sortedSemesters.length > 0) {
        setSelectedSemester({
          id: sortedSemesters[0].id,
          name: sortedSemesters[0].name,
          startAt: sortedSemesters[0].startAt.split("T")[0],
          endAt: sortedSemesters[0].endAt.split("T")[0],
        });
      }

      // Set available semesters: today <= endAt
      const today = new Date();
      const availableSemester = sortedSemesters.filter(
        (semester) => new Date(semester.endAt) >= today
      );
      setAvailableSemesters(availableSemester);
    } catch (error) {
      message.error("Failed to fetch semesters");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchRequestType = async () => {
    try {
      const result = await requestApi.getRequestTypes();

      setRequestTypes(result.requestTypes);
    } catch (error) {
      message.error("Failed to fetch request types");
    }
  };

  const addTodayAttendance = async () => {
    try {
      // Add today attendance, params is today (YYYY-MM-DD)
      const today = moment().format("YYYY-MM-DD");
      const result = await attendanceApi.addAllAttendanceByDate(today);
    } catch (error) {
      message.error("Failed to fetch today attendance");
    }
  };

  useEffect(() => {
    const fetchExamSlotBySemester = async () => {
      if (selectedSemester.id) {
        try {
          const result = await examSlotApi.getExamSlotBySemesterId(
            selectedSemester.id
          );

          const resconfig = await configApi.getAllConfigsBySemesterId(
            selectedSemester.id
          );

          setExamSlotBySemester(result || []);
          setConfigSemester(resconfig || []);
        } catch (error) {
          message.error("Failed to fetch exam slots");
        }
      }
    };
    fetchExamSlotBySemester();
  }, [selectedSemester, count]);

  // Fetch semesters and set the default selected semester
  useEffect(() => {
    fetchSemesters();
    fetchRequestType();
    addTodayAttendance();
  }, []);

  const reloadSlots = () => {
    setCount(count + 1);
  };

  return (
    <SemesterContext.Provider
      value={{
        selectedSemester,
        setSelectedSemester,
        semesters,
        availableSemesters,
        loading,
        examSlotBySemester,
        requestTypes,
        configSemester,
        reloadSlots,
      }} // Expose loading state
    >
      {children}
    </SemesterContext.Provider>
  );
};

// Custom hook to use the semester context
export const useSemester = () => {
  return useContext(SemesterContext);
};
