import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [role, setRole] = useState('');

    function parseJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    }

    useEffect(() => {
        let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)AUTH-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1");



        if (cookieValue) {
            try {
                const payload = parseJWT(cookieValue);
                const userRole = payload.role || 'invigilator';
                setRole(userRole);
                console.log('Role from cookie:', userRole);
                console.log('Role from state:', role);
                console.log('Role from payload:', userRole);
            } catch (error) {
                console.error('Failed to decode JWT:', error);
                setRole('invigilator');
            }
        } else {
            console.log('No AUTH-TOKEN cookie found');
        }
    }, [role]);

    useEffect(() => {

        localStorage.setItem('role', role);
        console.log('Role in local:', role);
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
