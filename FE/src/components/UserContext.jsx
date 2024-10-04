import React, { createContext, useState, useEffect } from 'react';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState('');

    useEffect(() => {
        const initRole = async () => {
            const role = await getRole();
            setRole(role);
        };
    }, []);

    return (
        <UserContext.Provider value={{ role }}>
            {children}
        </UserContext.Provider>
    );
}

// for Role