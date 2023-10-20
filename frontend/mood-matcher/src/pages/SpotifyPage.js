import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

function SpotifyPage() {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(token);
    
    // Extract user-specific data from the decoded token
    const userId = decodedToken.id;
    const userName = decodedToken.name;
    const userEmail = decodedToken.email;

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('spotifyAuthToken');
        if (token) {
            setIsAuthenticated(true);
            fetchTopTracks(token);
        }
    }, []);

    const fetchTopTracks = async (token) => {
        try {
            const response = await axios.get('/spotify/top-tracks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTopTracks(response.data);
        } catch (error) {
            console.error("Error fetching top tracks:", error);
        }
    };

    const handleSpotifyLogin = () => {
        window.location.href = '/spotify-auth';
    };

    const handleSpotifyLogout = () => {
        localStorage.removeItem('spotifyAuthToken');
        setIsAuthenticated(false);
    };

    return (
        <div>
            <h1>Welcome, {userName}!</h1>
            {!isAuthenticated ? (
                <button onClick={handleSpotifyLogin}>Login with Spotify</button>
            ) : (
                <div>
                    <h2>Your Top Tracks</h2>
                    <ul>
                        {topTracks.map(track => (
                            <li key={track.id}>{track.name} by {track.artists[0].name}</li>
                        ))}
                    </ul>
                    <button onClick={handleSpotifyLogout}>Logout from Spotify</button>
                </div>
            )}
        </div>
    );
}

export default SpotifyPage;
