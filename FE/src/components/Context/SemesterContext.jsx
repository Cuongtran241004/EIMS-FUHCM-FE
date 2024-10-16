import React, { createContext, useState, useContext, useEffect } from "react";
import { message } from "antd"; // Ensure to import message
import semesterApi from "../../services/Semester.js";

// Create a context for the semester
const SemesterContext = createContext();

// Provider component to wrap around your app
export const SemesterProvider = ({ children }) => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState({
    id: null,
    name: "Select semester",
  });
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
