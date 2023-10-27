import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function MoodSelection() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [moodIntensity, setMoodIntensity] = useState(50); // Default value for the slider
    const navigate = useNavigate();
    const moods = ['Happy', 'Sad', 'Energetic', 'Calm'];

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
        navigate(`/mood-playlist-creator?mood=${mood}&intensity=${moodIntensity}`); // Navigate to the MoodPlaylistCreator with mood and intensity as query parameters
    };

    const handleIntensityChange = (event) => {
        setMoodIntensity(event.target.value);
    };

    return (
        <div>
            <h2>Select Your Mood</h2>
            <div className="moods-container">
                {moods.map(mood => (
                    <div key={mood}>
                        <button 
                            className={selectedMood === mood ? 'selected' : ''}
                            onClick={() => handleMoodSelect(mood)}
                        >
                            {mood}
                        </button>
                        {selectedMood === mood && (
                            <div>
                                <label>{`Intensity of ${mood}: ${moodIntensity}%`}</label>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={moodIntensity} 
                                    onChange={handleIntensityChange} 
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MoodSelection;
