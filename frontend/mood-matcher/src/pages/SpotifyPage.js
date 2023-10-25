import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SpotifyPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState({
        displayName: '',
        profilePicture: '',
        country: '',
        followersCount: 0
    });
    const [topTracks, setTopTracks] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [timeRange, setTimeRange] = useState('short_term');

    useEffect(() => {
        console.log("SpotifyPage useEffect triggered");
        const token = localStorage.getItem('spotifyAccessToken');
        if (token) {
            console.log("Token found in localStorage:", token);
            setIsAuthenticated(true);
            fetchUserProfile(token);
            fetchTopTracks(token);
            fetchPlaylists(token);
        } else {
            console.warn("Token not found in localStorage");
        }
    }, []);

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

    const fetchTopTracks = async (token) => {
        console.log("Fetching top tracks");
        try {
            const response = await axios.get(`/spotify/top-tracks?time_range=${timeRange}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTopTracks(response.data);
        } catch (error) {
            console.error("Error fetching top tracks:", error);
        }
    };
    

    const fetchPlaylists = async (token) => {  // Function to fetch playlists
        console.log("Fetching playlists");
        try {
            const response = await axios.get('/spotify/user-playlists', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPlaylists(response.data);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };

    const initiateSpotifyLogin = () => {
        const popup = window.open('/spotify-auth', 'Spotify Login', 'width=600,height=400');
        window.spotifyLoginCallback = function(token) {
            localStorage.setItem('spotifyAccessToken', token);
            setIsAuthenticated(true);
            fetchUserProfile(token);
            fetchTopTracks(token);
            fetchPlaylists(token);
            popup.close();
        };
    };

    const handleSpotifyLogout = () => {
        localStorage.removeItem('spotifyAccessToken');
        setIsAuthenticated(false);
    };

    return (
        <div>
            <h1>Welcome, {userProfile.displayName}!</h1>
            {userProfile.profilePicture && <img src={userProfile.profilePicture} alt="Profile" />}
            <p>Country: {userProfile.country}</p>
            <p>Followers: {userProfile.followersCount}</p>
            {!isAuthenticated ? (
                <button onClick={initiateSpotifyLogin}>Login with Spotify</button>
            ) : (
                <div>
                    <h2>Your Top Tracks</h2>
                    <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                        <option value="short_term">Last 4 Weeks</option>
                        <option value="medium_term">Last 6 Months</option>
                        <option value="long_term">All Time</option>
                    </select>
                    <ul>
                        {topTracks.map(track => (
                            <li key={track.id}>{track.name} by {track.artists[0].name}</li>
                        ))}
                    </ul>
                    <h2>Your Playlists</h2>
                    <ul>
                        {playlists.map(playlist => (
                            <li key={playlist.id}>{playlist.name}</li>
                        ))}
                    </ul>
                    <button onClick={handleSpotifyLogout}>Logout from Spotify</button>
                </div>
            )}
        </div>
    );
}

export default SpotifyPage;