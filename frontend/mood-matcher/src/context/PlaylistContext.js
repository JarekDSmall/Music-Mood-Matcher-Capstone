import React, { createContext, useState, useContext } from 'react';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [playlists, setPlaylists] = useState([]);
    const [currentTracks, setCurrentTracks] = useState([]); // State for tracks being added
    const [mood, setMood] = useState(''); // State for mood
    const [genre, setGenre] = useState(''); // State for genre
    const [artist, setArtist] = useState(''); // State for artist (optional)

    const addTrackToCurrent = (track) => {
        setCurrentTracks(prevTracks => [...prevTracks, track]);
    };

    const removeTrackFromCurrent = (trackId) => {
        setCurrentTracks(prevTracks => prevTracks.filter(track => track.id !== trackId));
    };

    return (
        <PlaylistContext.Provider value={{ 
            playlists, 
            setPlaylists, 
            currentTracks, 
            addTrackToCurrent, 
            removeTrackFromCurrent,
            mood, 
            setMood,
            genre,
            setGenre,
            artist,
            setArtist
        }}>
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => {
    const context = useContext(PlaylistContext);
    if (!context) {
        throw new Error('usePlaylist must be used within a PlaylistProvider');
    }
    return context;
};
