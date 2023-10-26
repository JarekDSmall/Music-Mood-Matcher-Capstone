import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../../context/PlaylistContext'; // Assuming this is the correct path to your context

function MoodSelection() {
    const [selectedMood, setSelectedMood] = useState(null);
    const { setMood } = usePlaylist();
    const navigate = useNavigate();
    const moods = ['Happy', 'Sad', 'Energetic', 'Calm'];

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        setMood(mood);
        navigate('/next-route'); // Navigate to the next step or route
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
