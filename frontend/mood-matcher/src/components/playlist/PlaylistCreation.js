import React, { useEffect, useState } from 'react';
import axios from 'axios';  // <-- Import axios for making HTTP requests
import SpotifyWebApi from 'spotify-web-api-js';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

const spotifyApi = new SpotifyWebApi();

function PlaylistCreation() {
    const [songs, setSongs] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [moods, setMoods] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedMood, setSelectedMood] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    useEffect(() => {
        // Fetch moods and genres
        axios.get('/moods').then(response => setMoods(response.data));
        axios.get('/genres').then(response => setGenres(response.data));
    }, []);

    const handleSearch = (query) => {
        spotifyApi.searchTracks(query)
            .then(data => {
                setSearchResults(data.tracks.items);
            })
            .catch(error => {
                console.error('Error searching songs:', error);
            });
    };

    const handleTrackSelect = (track) => {
        setSongs(prevSongs => {
            if (prevSongs.some(song => song.id === track.id)) {
                return prevSongs;
            }
            return [...prevSongs, track];
        });
    };

    const handlePlaylistCreation = () => {
        // Here, you can make the API call to save the playlist based on the selected songs, mood, and genre
        axios.post('/playlists', { songs, mood: selectedMood, genre: selectedGenre })
            .then(response => {
                // Handle successful playlist creation, e.g., navigate to the playlist page or show a success message
            })
            .catch(error => {
                console.error("Error creating playlist:", error);
            });
    };

    return (
        <div>
            <div>
                <label>Mood:</label>
                <select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}>
                    {moods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
                </select>
            </div>
            <div>
                <label>Genre:</label>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
                </select>
            </div>
            <SearchBar onSearch={handleSearch} />
            <SearchResults tracks={searchResults} onTrackSelect={handleTrackSelect} />
            <h2>Your Playlist</h2>
            <ul>
                {songs.map(song => (
                    <li key={song.id}>{song.name} by {song.artists[0].name}</li>
                ))}
            </ul>
            <button onClick={handlePlaylistCreation}>Save Playlist</button>
        </div>
    );
}

export default PlaylistCreation;
