import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function GenreSelection() {
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGenres, setFilteredGenres] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch genres from Spotify API
        async function fetchGenres() {
            const response = await axios.get('http://localhost:5000/spotify/spotify-token'); // Fetch token from your backend
            const token = response.data.access_token;
            const genresResponse = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setGenres(genresResponse.data.genres);
        }
        fetchGenres();
    }, []);

    useEffect(() => {
        setFilteredGenres(
            genres.filter(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, genres]);

    const handleGenreSelection = (genre) => {
        // Handle the genre selection logic here
        // For example, navigate to the next step:
        navigate(`/create-playlist/tracks?genre=${genre}`);
    };

    return (
        <div>
            <h2>Select Your Favorite Genre</h2>
            <input 
                type="text" 
                placeholder="Search for a genre..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="genres-container">
                {filteredGenres.map(genre => (
                    <button key={genre} onClick={() => handleGenreSelection(genre)}>
                        {genre}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GenreSelection;
