import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Spotify.css';

function TopTracks() {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const response = await axios.get('/spotify/top-tracks');
                setTracks(response.data);
            } catch (error) {
                console.error("Error fetching top tracks:", error);
            }
        };

        fetchTopTracks();
    }, []);

    return (
        <div className="top-tracks-container">
            <h2>Your Top Tracks on Spotify</h2>
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>
                        {track.name} by {track.artists[0].name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopTracks;
