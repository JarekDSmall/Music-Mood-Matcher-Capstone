import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const register = async (email, password) => {
        // Here, you'll typically call your backend API to register the user.
        // For now, I'll just simulate a successful registration.
        setCurrentUser({ email }); // This is just a mock. Replace with actual user data from your backend.
        setIsAuthenticated(true);
    };

    const contextValue = {
        currentUser,
        isAuthenticated,
        login,
        logout,
        register  // <-- Added the register function here
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

