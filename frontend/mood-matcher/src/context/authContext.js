import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('spotifyAuthToken') !== null);
    const navigate = useNavigate();

    const loginWithSpotifyToken = (token) => {
        localStorage.setItem('spotifyAuthToken', token);
        setIsAuthenticated(true);
    };
    
    const logoutFromSpotify = useCallback(() => {
        localStorage.removeItem('spotifyAuthToken'); // Clearing the Spotify token from local storage
        setIsAuthenticated(false);
    
        // Redirect to Spotify's logout page
        window.location.href = 'https://accounts.spotify.com/en/logout';
    
        // After a short delay, redirect back to your app's login page
        setTimeout(() => {
            navigate('/spotify-login');
        }, 2000); // Adjust the delay as needed
    }, [navigate]);

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

// New component to handle the logout process
export const Logout = () => {
    const { logoutFromSpotify } = useAuth();
    logoutFromSpotify(); // Call the logout function on component render

    return null; // This component does not render anything
};
