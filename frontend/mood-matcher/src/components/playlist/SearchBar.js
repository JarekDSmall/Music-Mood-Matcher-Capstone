import React, { useState } from 'react';
import axios from 'axios';
import { usePlaylist } from '../../context/PlaylistContext';


function SearchBar() {
    const [query, setQuery] = useState('');
    const { addTrackToCurrent } = usePlaylist();

    const searchSpotify = async () => {
        try {
            // Get Spotify token from your backend
            const tokenResponse = await axios.get('http://localhost:5000/spotify/spotify-token');
            const spotifyToken = tokenResponse.data.access_token;

            // Use the token to search Spotify
            const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
                headers: {
                    'Authorization': `Bearer ${spotifyToken}`
                }
            });

            const tracks = response.data.tracks.items;
            // Handle the tracks as needed, e.g., set them in state or context
            tracks.forEach(track => addTrackToCurrent(track));

        } catch (error) {
            console.error('Error searching Spotify:', error);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search for a track" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={searchSpotify}>Search</button>
        </div>
    );
}

export default SearchBar;
