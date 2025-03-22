import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null); // User role like 'admin', 'doctor', 'patient'
    const [userId, setUserId] = useState(null); // User role like 'admin', 'doctor', 'patient'

    const login = async (credentials) => {
        // Simulate API call to Django backend for login
        const response = await axios.post("127.0.0.1:8000/api/login", {
            email: credentials.email,
            password: credentials.password,
        });
        const data = await response.json();
        if (response.status == 200) {
            setRole(data.role); // Assuming backend sends the user's role
            setUserId(data.userId); // Assuming backend sends the user's role
            return true;
        }
        return false;
    };

    const logout = () => {
        setRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
