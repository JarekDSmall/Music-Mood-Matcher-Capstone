import React from 'react';
import '../../styles/Song.css';

function SongDetail({ song }) {
    return (
        <div className="song-detail-container">
            <h2>{song.title}</h2>
            <p><strong>Artist:</strong> {song.artist}</p>
            <p><strong>Album:</strong> {song.album}</p>
            <p><strong>Release Year:</strong> {song.year}</p>
            {/* You can add more details or functionalities like play, add to playlist, etc. */}
        </div>
    );
}

export default SongDetail;
