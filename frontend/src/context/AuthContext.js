// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};
