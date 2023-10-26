// ArtistSelection.js
import React, { useState } from 'react';

function ArtistSelection({ onArtistSelect }) {
    const [artist, setArtist] = useState('');

    const handleArtistChange = (event) => {
        setArtist(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onArtistSelect(artist);
    };

    return (
        <div>
            <h2>Enter Your Favorite Artist</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={artist} onChange={handleArtistChange} placeholder="Enter artist name" />
                <button type="submit">Next</button>
            </form>
        </div>
    );
}

export default ArtistSelection;
