import React, { useContext, useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { PlaylistContext } from '../context/PlaylistContext';
import { createPlaylist, addTracksToPlaylist } from '../utility/spotifyAPI'; // Import the necessary functions

function CreatePlaylist() {
    const { mood, setMood, genre, setGenre, artist, setArtist, currentTracks } = useContext(PlaylistContext);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [playlistName, setPlaylistName] = useState(''); // State for playlist name

    const addTrackToPlaylist = (track) => {
        setSelectedTracks(prevTracks => [...prevTracks, track]);
    };

    const finalizePlaylist = async () => {
        // Assuming you have a way to get the user's Spotify ID, for example, from the context or local storage
        const userId = 'YOUR_USER_ID'; // Replace with the actual method to get the user's ID

        try {
            const playlist = await createPlaylist(userId, playlistName, `A ${mood} and ${genre} playlist featuring ${artist}`);
            if (playlist) {
                const trackUris = selectedTracks.map(track => track.uri);
                const success = await addTracksToPlaylist(playlist.id, trackUris);
                if (success) {
                    alert(`Playlist created! You can listen to it on Spotify: ${playlist.external_urls.spotify}`);
                }
            }
        } catch (error) {
            console.error("Error finalizing playlist:", error);
        }
    };

    return (
        <div>
            <h2>Create New Playlist</h2>
            <input 
                type="text" 
                placeholder="Playlist Name" 
                value={playlistName} 
                onChange={(e) => setPlaylistName(e.target.value)} 
            />
            
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                {/* ... */}
            </select>

            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                {/* ... */}
            </select>

            <input 
                type="text" 
                value={artist} 
                onChange={(e) => setArtist(e.target.value)} 
                placeholder="Artist (optional)" 
            />

            <SearchBar />
            <SearchResults tracks={currentTracks} onAddTrack={addTrackToPlaylist} />
            <button onClick={finalizePlaylist}>Finalize Playlist</button>
        </div>
    );
}

export default CreatePlaylist;
