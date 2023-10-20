// GenreSelection.js

import React, { useState } from 'react';

function GenreSelection() {
    const [selectedGenre, setSelectedGenre] = useState(null);
    const genres = ['Rock', 'Pop', 'Jazz', 'Classical']; // Add more genres as needed

    return (
        <div>
            <h2>Select Your Favorite Genre</h2>
            <div className="genres-container">
                {genres.map(genre => (
                    <button 
                        key={genre}
                        className={selectedGenre === genre ? 'selected' : ''}
                        onClick={() => setSelectedGenre(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GenreSelection;
