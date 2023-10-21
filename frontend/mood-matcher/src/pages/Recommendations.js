import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Recommendations() {
    const [genres, setGenres] = useState(['pop', 'rock', 'jazz', 'classical', 'hip-hop']); // Sample genres
    const [selectedGenre, setSelectedGenre] = useState('pop'); // Default genre
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const response = await axios.get(`/spotify/recommendations?genre=${selectedGenre}`);
                setTracks(response.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                // Handle error (e.g., show a notification to the user)
            }
        }

        fetchRecommendations();
    }, [selectedGenre]);

    return (
        <div>
            <h2>Recommended Tracks</h2>
            <label>Select Genre: </label>
            <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                ))}
            </select>

            <ul>
                {tracks.map(track => (
                    <li key={track.id}>{track.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Recommendations;
