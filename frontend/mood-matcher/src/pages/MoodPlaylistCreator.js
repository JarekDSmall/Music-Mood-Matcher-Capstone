import React, { useState } from 'react';

function MoodPlaylistCreator() {
    const [mood, setMood] = useState(''); // State for mood selection
    const [artist, setArtist] = useState(''); // State for artist input

    const handleMoodChange = (event) => {
        setMood(event.target.value);
    };

    const handleArtistChange = (event) => {
        setArtist(event.target.value);
    };

    const handleSubmit = () => {
        // Here, you can make API calls or any other logic to create the playlist based on the mood and artist
        console.log(`Creating playlist for mood: ${mood} and artist: ${artist}`);
    };

    return (
        <div>
            <h2>Create a Mood Playlist</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Mood:</label>
                    <select value={mood} onChange={handleMoodChange}>
                        <option value="">--Select Mood--</option>
                        <option value="happy">Happy</option>
                        <option value="sad">Sad</option>
                        <option value="energetic">Energetic</option>
                        <option value="relaxed">Relaxed</option>
                        {/* Add more moods as needed */}
                    </select>
                </div>
                <div>
                    <label>Choose Artist:</label>
                    <input type="text" value={artist} onChange={handleArtistChange} placeholder="Enter artist name" />
                </div>
                <button type="submit">Create Playlist</button>
            </form>
        </div>
    );
}

export default MoodPlaylistCreator;
