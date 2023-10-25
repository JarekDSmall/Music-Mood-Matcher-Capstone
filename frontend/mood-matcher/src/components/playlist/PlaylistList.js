import React, { useState, useEffect } from 'react';
import '../../styles/Playlist.css';

function PlaylistList() {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        // Fetch user's playlists from the backend
        fetch('/spotify/user-playlists') // Adjust the endpoint if needed
            .then(response => response.json())
            .then(data => setPlaylists(data.map(playlist => playlist.name))) // Extracting playlist names
            .catch(error => console.error('Error fetching playlists:', error));
    }, []);

    return (
        <div className="playlist-list">
            <h2>Your Playlists</h2>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist}>{playlist}</li>
                ))}
            </ul>
        </div>
    );
}

export default PlaylistList;
