import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        const savedName = sessionStorage.getItem('studentName');
        if (savedName) setName(savedName);
    }, []);

    const saveName = (newName) => {
        sessionStorage.setItem('studentName', newName);
        setName(newName);
    };

    return (
        <UserContext.Provider value={{ name, setName: saveName }}>
            {children}
        </UserContext.Provider>
    );
};
