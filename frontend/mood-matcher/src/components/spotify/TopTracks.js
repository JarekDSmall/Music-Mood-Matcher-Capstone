import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Spotify.css';

function TopTracks() {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const response = await axios.get('/spotify/top-tracks');
                const tracksWithMood = await Promise.all(response.data.map(async track => {
                    const moodResponse = await axios.get(`/spotify/track-features/${track.id}`);
                    return {
                        ...track,
                        mood: determineMood(moodResponse.data)
                    };
                }));
                setTracks(tracksWithMood);
            } catch (error) {
                console.error("Error fetching top tracks:", error);
            }
        };

        const determineMood = (features) => {
            if (features.valence > 0.7 && features.energy > 0.6) {
                return 'Happy';
            } else if (features.valence < 0.4 && features.energy < 0.4) {
                return 'Sad';
            } else if (features.energy > 0.7 && features.tempo > 120) {
                return 'Energetic';
            } else if (features.energy < 0.3 && features.tempo < 100) {
                return 'Relaxed';
            } else if (features.valence < 0.5 && features.energy > 0.6) {
                return 'Angry';
            } else if (features.danceability > 0.7 && features.energy > 0.6) {
                return 'Dancey';
            } else if (features.acousticness > 0.7) {
                return 'Acoustic';
            } else if (features.instrumentalness > 0.5) {
                return 'Instrumental';
            }
            return 'Neutral'; // default mood
        };        

        fetchTopTracks();
    }, []);

    return (
        <div className="top-tracks-container">
            <h2>Your Top Tracks on Spotify</h2>
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>
                        {track.name} by {track.artists[0].name} - Mood: {track.mood}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopTracks;
