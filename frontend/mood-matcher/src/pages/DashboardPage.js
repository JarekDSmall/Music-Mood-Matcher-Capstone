import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const DashboardPage = () => {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(token);
    
    const [topTracks, setTopTracks] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
    const [spotifyAccessToken, setSpotifyAccessToken] = useState(null); // Store the Spotify access token
    const [newPlaylistName, setNewPlaylistName] = useState(''); // State to store the new playlist name

    useEffect(() => {
        const spotifyToken = localStorage.getItem('spotifyAuthToken');
        if (spotifyToken) {
            setIsSpotifyConnected(true);
            setSpotifyAccessToken(spotifyToken);
            fetchTopTracks(spotifyToken);
            fetchPlaylists(spotifyToken);
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

    const fetchPlaylists = async (token) => {
        try {
            const response = await axios.get('/playlists', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPlaylists(response.data);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };

    const handleCreatePlaylist = async () => {
        try {
            const response = await axios.post('/playlists/create', {
                name: newPlaylistName
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPlaylists([...playlists, response.data.playlist]);
            setNewPlaylistName('');
        } catch (error) {
            console.error("Error creating playlist:", error);
        }
    };

    const handleContinueWithoutSpotify = async () => {
        try {
            const response = await axios.get("http://localhost:5000/spotify/spotify-token"); // Backend route for Client Credentials Flow
            const token = response.data.access_token;
            localStorage.setItem('spotifyAuthToken', token); // Store the token in local storage
            setSpotifyAccessToken(token);
            setIsSpotifyConnected(true);
        } catch (error) {
            console.error("Error getting Spotify token for non-user:", error);
        }
    };

    return (
        <div>
            <h1>Welcome to the Dashboard, {decodedToken.name}!</h1>
            <p>Email: {decodedToken.email}</p>
            
            {isSpotifyConnected ? (
                <>
                    <h2>Your Top Tracks</h2>
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
                    <div>
                        <input 
                            type="text" 
                            placeholder="Enter new playlist name" 
                            value={newPlaylistName}
                            onChange={e => setNewPlaylistName(e.target.value)}
                        />
                        <button onClick={handleCreatePlaylist}>Create Playlist</button>
                    </div>
                </>
            ) : (
                <div>
                    <p>You haven't connected your Spotify account yet. Connect now to see your top tracks and playlists!</p>
                    <button onClick={() => window.location.href = '/spotify-auth'}>Connect with Spotify</button>
                    <button onClick={handleContinueWithoutSpotify}>Continue without Spotify</button>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
