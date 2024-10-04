import React, { createContext, useState, useEffect } from 'react';
import { getUserInfo } from './API/getUserInfo';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState('');

    useEffect(() => {
        const initRole = async () => {
            const role = await getUserInfo();
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