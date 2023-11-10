import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation
import '../styles/SpotifyPage.css'

function SpotifyPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState({
        displayName: '',
        profilePicture: '',
        country: '',
        followersCount: 0
    });
    const [userTopTracks, setUserTopTracks] = useState([]);
    const [playlists, setPlaylists] = useState([]);
   

    useEffect(() => {
        console.log("SpotifyPage useEffect triggered");
        const token = localStorage.getItem('spotifyAccessToken');
        if (token) {
            console.log("Token found in localStorage:", token);
            setIsAuthenticated(true);
            fetchUserProfile(token);
            fetchUserTopTracks(token);
            fetchPlaylists(token);
        } else {
            console.warn("Token not found in localStorage");
        }
    }, []);

    const navigate = useNavigate()

    const fetchUserProfile = async (token) => {
        console.log("Fetching user profile");
        try {
            const response = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = response.data;
            setUserProfile({
                displayName: data.display_name,
                profilePicture: data.images[0]?.url,
                country: data.country,
                followersCount: data.followers?.total
            });
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleUnauthorizedError = async (retryFunction) => {
        const newToken = await refreshToken();
        if (newToken) {
            return retryFunction(newToken);
        } else {
            console.error("Failed to refresh token");
            return null;
        }
    };

    const fetchUserTopTracks = async (token) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setUserTopTracks(response.data.items); // Assuming the tracks are in the 'items' property
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return handleUnauthorizedError(fetchUserTopTracks);
        }
        console.error('Error fetching user top tracks:', error);
    }
};

    
    
const fetchPlaylists = async (token) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setPlaylists(response.data.items); // Assuming the playlists are in the 'items' property
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return handleUnauthorizedError(fetchPlaylists);
        }
        console.error("Error fetching playlists:", error);
    }
};

    
    const refreshToken = async () => {
        try {
            // Assuming you store the refresh token in local storage. Retrieve it.
            const storedRefreshToken = localStorage.getItem('spotifyRefreshToken');
    
            // Send the refresh token to your backend (if required)
            const response = await axios.post('http://localhost:5000/spotify/refresh-token', {
                refreshToken: storedRefreshToken
            });
    
            const newToken = response.data.access_token;
    
            if (newToken) {
                localStorage.setItem('spotifyAccessToken', newToken); // Update the token in local storage
                return newToken;
            } else {
                console.error("No access token received from refresh endpoint.");
                return null;
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            // Optionally, handle the error more gracefully here, e.g., redirect to login
            return null;
        }
    };
    
  
    const initiateSpotifyLogin = () => {
        const popup = window.open('/spotify-auth', 'Spotify Login', 'width=600,height=400');
        window.spotifyLoginCallback = function(token) {
            localStorage.setItem('spotifyAccessToken', token);
            setIsAuthenticated(true);
            fetchUserProfile(token);
            fetchUserTopTracks(token);
            fetchPlaylists(token);
            popup.close();
        };
    };

    const handleSpotifyLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
        setIsAuthenticated(false);
        navigate('/');  // Navigate back to the home page
    };

    const navigateToMoodPlaylistCreator = () => {
        navigate('/mood-playlist-creator');
    };

    return (
        <div className="spotify-container">
            <h1 className="spotify-header">Welcome, {userProfile.displayName}!</h1>
            {userProfile.profilePicture && (
                <img
                    src={userProfile.profilePicture}
                    alt="Profile"
                    className="spotify-profile-picture"
                />
            )}
            <p>Country: {userProfile.country}</p>
            <p>Followers: {userProfile.followersCount}</p>
            {!isAuthenticated ? (
                <button onClick={initiateSpotifyLogin} className="spotify-button">Login with Spotify</button>
            ) : (
                <div>
                    <h2>Your Top Tracks</h2>
                    <ul className="spotify-list">
                        {userTopTracks.map(track => (
                            <li key={track.id} className="spotify-list-item">
                                {track.name} by {track.artists[0].name}
                            </li>
                        ))}
                    </ul>
                    <h2>Your Playlists</h2>
                    <ul className="spotify-list">
                        {playlists.map(playlist => (
                            <li key={playlist.id} className="spotify-list-item">{playlist.name}</li>
                        ))}
                    </ul>
                    <button onClick={navigateToMoodPlaylistCreator} className="spotify-button">Create a Mood Playlist</button>
                    {/* <button onClick={handleSpotifyLogout} className="spotify-button logout-button">Logout from Spotify</button> */}
                </div>
            )}
        </div>
    );
}

export default SpotifyPage;