import React, { createContext, useState, useContext } from "react";

// Create a context for the semester
const SemesterContext = createContext();

// Provider component to wrap around your app
export const SemesterProvider = ({ children }) => {
  const [selectedSemester, setSelectedSemester] = useState(null);

  return (
    <SemesterContext.Provider value={{ selectedSemester, setSelectedSemester }}>
      {children}
    </SemesterContext.Provider>
  );
};

// Custom hook to use the semester context
export const useSemester = () => {
  return useContext(SemesterContext);
};
