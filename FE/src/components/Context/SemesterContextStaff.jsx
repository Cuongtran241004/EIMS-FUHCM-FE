import React, { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd"; // Ensure to import message
import semesterApi from "../../services/Semester.js";
import configApi from "../../services/Config.js";

// Create a context for the semester
const SemesterContext = createContext();

// Provider component to wrap around your app
export const SemesterProviderStaff = ({ children }) => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState({
    id: null,
    name: "Select semester",
  });
  const [configSemester, setConfigSemester] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

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
  const fetchConfigSemester = async () => {
    try {
      const resconfig = await configApi.getAllConfigsBySemesterId(
        selectedSemester.id
      );
      setConfigSemester(resconfig || []);
    } catch (error) {}
  };
  useEffect(() => {
    if (selectedSemester.id) {
      fetchConfigSemester();
    }
  }, [selectedSemester]);

  // Fetch semesters and set the default selected semester
  useEffect(() => {
    fetchSemesters();
  }, []);

  return (
    <SemesterContext.Provider
      value={{
        selectedSemester,
        setSelectedSemester,
        semesters,
        availableSemesters,
        loading,
        configSemester,
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
