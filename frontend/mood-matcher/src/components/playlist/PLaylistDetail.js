import React from 'react';
import '../../styles/Playlist.css';

function PlaylistDetail() {
    // Sample data for now
    const playlist = {
        name: 'Chill Vibes',
        songs: ['Song 1', 'Song 2', 'Song 3']
    };

    return (
        <div className="playlist-detail">
            <h2>{playlist.name}</h2>
            <ul>
                {playlist.songs.map(song => (
                    <li key={song}>{song}</li>
                ))}
            </ul>
        </div>
    );
}

export default PlaylistDetail;
