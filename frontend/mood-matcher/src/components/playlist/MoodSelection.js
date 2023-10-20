// MoodSelection.js

import React, { useState } from 'react';

function MoodSelection() {
    const [selectedMood, setSelectedMood] = useState(null);
    const moods = ['Happy', 'Sad', 'Energetic', 'Calm']; // Add more moods as needed

    return (
        <div>
            <h2>Select Your Mood</h2>
            <div className="moods-container">
                {moods.map(mood => (
                    <button 
                        key={mood}
                        className={selectedMood === mood ? 'selected' : ''}
                        onClick={() => setSelectedMood(mood)}
                    >
                        {mood}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MoodSelection;
