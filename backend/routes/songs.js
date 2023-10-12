const express = require('express');
const Song = require('../models/song');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

// Add a new song
router.post('/add', authenticateJWT, async (req, res) => {
    try {
        const { title, artist, album, duration } = req.body;
        const userId = req.user.id;

        const newSong = new Song({
            title,
            artist,
            album,
            duration,
            userId
        });

        await newSong.save();
        res.status(201).json({ message: 'Song added successfully!', song: newSong });

    } catch (error) {
        console.error('Error adding song:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// TODO: Add other song-related routes (e.g., get all songs, update a song, delete a song, etc.)

module.exports = router;
