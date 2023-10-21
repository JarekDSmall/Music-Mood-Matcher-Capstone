import React, { useContext } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { PlaylistContext } from '../context/PlaylistContext';

function CreatePlaylist() {
    const { mood, setMood, genre, setGenre, artist, setArtist, currentTracks } = useContext(PlaylistContext);

    return (
        <div>
            <h2>Create New Playlist</h2>
            <input type="text" placeholder="Playlist Name" />
            
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
                {/* Add your moods here */}
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                {/* ... */}
            </select>

            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                {/* Add your genres here */}
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                {/* ... */}
            </select>

            <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Artist (optional)" />

            <SearchBar />
            <SearchResults tracks={currentTracks} />
            <button>Finalize Playlist</button>
        </div>
    );
}

export default CreatePlaylist;
