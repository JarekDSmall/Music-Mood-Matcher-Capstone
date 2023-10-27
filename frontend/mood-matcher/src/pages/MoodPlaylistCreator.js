import React, { useState, useEffect } from 'react';
import { searchTracks, createPlaylist, fetchUserProfile, fetchRecommendations, addTracksToPlaylist } from '../utility/spotifyAPI';


function MoodPlaylistCreator() {
    const [mood, setMood] = useState('');
    const [moodIntensity, setMoodIntensity] = useState(50);
    const [tracks, setTracks] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userProfile = await fetchUserProfile();
                setUserId(userProfile.id);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
        fetchUserId();
    }, []);

    const handleMoodChange = (event) => {
        setMood(event.target.value);
    };

    const handleIntensityChange = (event) => {
        setMoodIntensity(event.target.value);
    };

    const fetchTracks = async () => {
        try {
            // Search tracks based on mood to get seed tracks
            const seedTracks = await searchTracks(mood);
            const seedTrackIds = seedTracks.slice(0, 5).map(track => track.id); // Use the first 5 tracks as seeds

            // Fetch recommendations based on seed tracks
            const recommendedTracks = await fetchRecommendations(seedTrackIds);

            setTracks(recommendedTracks);
        } catch (error) {
            console.error("Error fetching tracks:", error);
        }
    };

    const handleSubmit = async () => {
        if (!userId) {
            console.error("User ID not available.");
            return;
        }
        try {
            const playlist = await createPlaylist(userId, `Mood Playlist - ${mood}`, `A playlist based on ${mood} mood with ${moodIntensity}% intensity.`);
            if (playlist && playlist.id) {
                // Add tracks to the created playlist
                const trackUris = tracks.map(track => track.uri);
                const success = await addTracksToPlaylist(playlist.id, trackUris);
                if (success) {
                    console.log("Tracks added to the playlist successfully.");
                    // Provide a link to the created playlist
                    window.alert(`Playlist created successfully! You can view it here: https://open.spotify.com/playlist/${playlist.id}`);
                } else {
                    console.error("Error adding tracks to the playlist.");
                }
            } else {
                console.error("Error creating playlist.");
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
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
                        <option value="Relaxed">Relaxed</option>
                        <option value="Motivated">Motivated</option>
                        <option value="Angry">Angry</option>
                        <option value="Romantic">Romantic</option>
                        <option value="Melancholic">Melancholic</option>
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
