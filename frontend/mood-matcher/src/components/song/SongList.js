import React from 'react';
import SongDetail from './SongDetail';
import '../../styles/Song.css';

function SongList() {
    const songs = [
        { title: "Song 1", artist: "Artist 1", album: "Album 1", year: "2001" },
        { title: "Song 2", artist: "Artist 2", album: "Album 2", year: "2002" },
        // ... add more songs as needed
    ];

    return (
        <div className="song-list-container">
            <h2>Songs</h2>
            {songs.map((song, index) => (
                <SongDetail key={index} song={song} />
            ))}
        </div>
    );
}

export default SongList;
