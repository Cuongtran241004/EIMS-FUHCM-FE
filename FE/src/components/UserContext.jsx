import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: localStorage.getItem("role"),
    firstName: localStorage.getItem("firstName"),
    lastName: localStorage.getItem("lastName"),
  });

  useEffect(() => {
    const storedUser = {
      role: localStorage.getItem("role"),
      firstName: localStorage.getItem("firstName"),
      lastName: localStorage.getItem("lastName"),
    };
    setUser(storedUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
