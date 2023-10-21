import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../../context/PlaylistContext'; // Updated to use the correct hook

function MoodSelection() {
    const [selectedMood, setSelectedMood] = useState(null);
    const { setMood } = usePlaylist(); // Using the correct hook
    const navigate = useNavigate();
    const moods = ['Happy', 'Sad', 'Energetic', 'Calm'];

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        setMood(mood);
        navigate('/next-route'); // Replaced history.push with navigate
    };

    return (
        <div>
            <h2>Select Your Mood</h2>
            <div className="moods-container">
                {moods.map(mood => (
                    <button 
                        key={mood}
                        className={selectedMood === mood ? 'selected' : ''}
                        onClick={() => handleMoodSelect(mood)}
                    >
                        {mood}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MoodSelection;
