const express = require('express');
const Playlist = require('../models/playlist');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

// Create a new playlist
router.post('/create', authenticateJWT, async (req, res) => {
    try {
        const { name, description, songs } = req.body;
        const userId = req.user.id;

        const newPlaylist = new Playlist({
            name,
            description,
            songs,
            userId
        });

        await newPlaylist.save();
        res.status(201).json({ message: 'Playlist created successfully!', playlist: newPlaylist });

    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// TODO: Add other playlist-related routes (e.g., get all playlists, update a playlist, delete a playlist, add songs to a playlist, etc.)

module.exports = router;
