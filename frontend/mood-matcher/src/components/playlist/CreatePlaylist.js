import React, { useState } from 'react';
import '../../styles/CreatePlaylist.css';

function CreatePlaylist() {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to create a new playlist
        console.log(`Created playlist: ${name}`);
    };

    return (
        <div className="create-playlist">
            <h2>Create a New Playlist</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Playlist Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreatePlaylist;
