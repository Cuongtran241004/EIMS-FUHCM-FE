import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState('');


    useEffect(() => {
        let roleValue = localStorage.getItem('role');
            try {
                
                const userRole = roleValue || 'Invigilator';
                setRole(userRole);
            } catch (error) {
                setRole('invigilator');
            }
       
    }, [role]);





    return (
        <UserContext.Provider value={role}>
            {children}
            {
                useEffect(() => {
                    console.log('User role in provider:', role);
                }, [role])

            }
        </UserContext.Provider>
    );
}
