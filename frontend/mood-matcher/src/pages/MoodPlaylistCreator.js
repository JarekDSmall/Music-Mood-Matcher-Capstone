import React, { useState } from 'react';
import { fetchTopTracks, searchTracks, createPlaylist } from '../utility/spotifyAPI'; // Adjust the path accordingly

function MoodPlaylistCreator() {
    const [mood, setMood] = useState(''); // State for mood selection
    const [moodIntensity, setMoodIntensity] = useState(50); // State for mood intensity
    const [tracks, setTracks] = useState([]); // State to store fetched tracks

    const handleMoodChange = (event) => {
        setMood(event.target.value);
    };

    const handleIntensityChange = (event) => {
        setMoodIntensity(event.target.value);
    };

    const fetchTracks = async () => {
        try {
            // Fetch user's top tracks
            const topTracks = await fetchTopTracks();

            // Search tracks based on mood
            const moodTracks = await searchTracks(mood);

            // Combine the tracks (this is just an example, you can have your own logic)
            const combinedTracks = [...topTracks, ...moodTracks];

            setTracks(combinedTracks);
        } catch (error) {
            console.error("Error fetching tracks:", error);
        }
    };

    const handleSubmit = async () => {
        try {
            // Logic to create the playlist based on the mood and moodIntensity
            const userId = 'YOUR_USER_ID'; // You should fetch the user's ID dynamically
            const playlist = await createPlaylist(userId, `Mood Playlist - ${mood}`, `A playlist based on ${mood} mood with ${moodIntensity}% intensity.`);
            console.log("Playlist created successfully:", playlist);
        } catch (error) {
            console.error("Error creating playlist:", error);
        }
    };

    return (
        <div>
            <h2>Create a Mood Playlist</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Mood:</label>
                    <select value={mood} onChange={handleMoodChange}>
                        <option value="">--Select Mood--</option>
                        <option value="Happy">Happy</option>
                        <option value="Sad">Sad</option>
                        <option value="Energetic">Energetic</option>
                        <option value="Calm">Calm</option>
                        {/* Add more moods as needed */}
                    </select>
                    {mood && (
                        <div>
                            <label>{`Intensity of ${mood}: ${moodIntensity}%`}</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={moodIntensity} 
                                onChange={handleIntensityChange} 
                            />
                        </div>
                    )}
                </div>
                <button type="button" onClick={fetchTracks}>Fetch Tracks</button>
                <div>
                    <ul>
                        {tracks.map(track => (
                            <li key={track.id}>{track.name}</li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Create Playlist</button>
            </form>
        </div>
    );
}

export default MoodPlaylistCreator;
