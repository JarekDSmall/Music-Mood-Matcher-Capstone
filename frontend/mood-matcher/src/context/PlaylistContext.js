import React, { createContext, useState, useContext } from 'react';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
    const [playlists, setPlaylists] = useState([]);

    const addPlaylist = (playlist) => {
        setPlaylists(prevPlaylists => [...prevPlaylists, playlist]);
    };

    const removePlaylist = (playlistId) => {
        setPlaylists(prevPlaylists => prevPlaylists.filter(pl => pl.id !== playlistId));
    };

    return (
        <PlaylistContext.Provider value={{ playlists, setPlaylists, addPlaylist, removePlaylist }}>
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
