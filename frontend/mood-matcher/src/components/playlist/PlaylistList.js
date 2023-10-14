import React from 'react';
import '../../styles/Playlist.css';


function PlaylistList() {
    // Sample data for now
    const playlists = ['Chill Vibes', 'Workout Mix', 'Golden Oldies'];

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
