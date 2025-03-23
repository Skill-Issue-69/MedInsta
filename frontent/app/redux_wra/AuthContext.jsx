import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [role, setRole] = useState(null); // User role like 'admin', 'doctor', 'patient'
    const [userId, setUserId] = useState(null); // User role like 'admin', 'doctor', 'patient'

    const login = async (credentials) => {
        // Simulate API call to Django backend for login
        console.log(credentials);
        const response = await axios.post(
            "http://192.168.25.62:8000/api/login/",
            {
                email: credentials.email,
                password: credentials.password,
            }
        );
        const data = response.data;

        if (response.status == 200) {
            setRole(data.role); // Assuming backend sends the user's role
            setUserId(data.user_id); // Assuming backend sends the user's role
            return true;
        }
        return false;
    };

    const logout = () => {
        setRole(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider
            value={{ role, login, logout, setUserId, setRole, userId }}
        >
            {children}
        </AuthContext.Provider>
    );
};
