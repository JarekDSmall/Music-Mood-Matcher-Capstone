import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('spotifyAuthToken') !== null);

    const loginWithSpotifyToken = (token) => {
        localStorage.setItem('spotifyAuthToken', token);
        setIsAuthenticated(true);
    };
    
    const logoutFromSpotify = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('spotifyAuthToken'); // Clearing the Spotify token from local storage
    };    

    const contextValue = {
        isAuthenticated,
        loginWithSpotifyToken,
        logoutFromSpotify
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
