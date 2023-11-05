import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const DashboardPage = () => {
    const token = localStorage.getItem('jwtToken');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    const [topTracks, setTopTracks] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
    const [spotifyAccessToken, setSpotifyAccessToken] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState('');

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
            const response = await axios.post('/spotify/create-playlist', {
                name: newPlaylistName,
                userId: userId
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
            const response = await axios.get("http://localhost:5000/spotify/spotify-token");
            const token = response.data.access_token;
            localStorage.setItem('spotifyAuthToken', token);
            setSpotifyAccessToken(token);
            setIsSpotifyConnected(true);
        } catch (error) {
            console.error("Error getting Spotify token for non-user:", error);
        }
    };

    return (
        <div style={{ backgroundColor: '#F2D7D5', color: '#6B8E23', padding: '20px', minHeight: '100vh' }}>
            <h1 style={{ color: '#FF7F50', marginBottom: '20px' }}>Welcome to the Dashboard, {decodedToken.name}!</h1>
            <p>Email: {decodedToken.email}</p>
            
            {isSpotifyConnected ? (
                <>
                    <h2 style={{ /* Your h2 styles here */ }}>Your Top Tracks</h2>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {topTracks.map(track => (
                            <li key={track.id} style={{ backgroundColor: '#FFD700', color: '#2F4F4F', padding: '10px', marginBottom: '5px', borderRadius: '5px' }}>
                                {track.name} by {track.artists[0].name}
                            </li>
                        ))}
                    </ul>

                    <h2 style={{ /* Your h2 styles here */ }}>Your Playlists</h2>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {playlists.map(playlist => (
                            <li key={playlist.id} style={{ backgroundColor: '#FFD700', color: '#2F4F4F', padding: '10px', marginBottom: '5px', borderRadius: '5px' }}>
                                {playlist.name}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Enter new playlist name" 
                            value={newPlaylistName}
                            onChange={e => setNewPlaylistName(e.target.value)}
                            style={{ padding: '10px', marginBottom: '10px', border: '2px solid #FF7F50', borderRadius: '5px' }}
                        />
                        <button 
                            onClick={handleCreatePlaylist} 
                            style={{ backgroundColor: '#DE3163', color: '#FFFFFF', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                        >
                            Create Playlist
                        </button>
                    </div>
                </>
            ) : (
                <div>
                    <p>You haven't connected your Spotify account yet. Connect now to see your top tracks and playlists!</p>
                    <button 
                        onClick={() => window.location.href = '/spotify-auth'} 
                        style={{ backgroundColor: '#DE3163', color: '#FFFFFF', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                    >
                        Connect with Spotify
                    </button>
                    <button 
                        onClick={handleContinueWithoutSpotify} 
                        style={{ backgroundColor: '#DE3163', color: '#FFFFFF', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}
                    >
                        Continue without Spotify
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
