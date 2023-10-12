const express = require('express');
const User = require('../models/user'); // Assuming you have a User model with a playlist field
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

// Add a song to user's playlist
router.post('/add-to-playlist', authenticateJWT, async (req, res) => {
    try {
        const { spotifySongId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add the Spotify song ID to the user's playlist
        if (!user.playlist) user.playlist = [];
        user.playlist.push(spotifySongId);

        await user.save();
        res.status(201).json({ message: 'Song added to playlist successfully!', playlist: user.playlist });

    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// Remove a song from user's playlist
router.delete('/remove-from-playlist', authenticateJWT, async (req, res) => {
    try {
        const { spotifySongId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Ensure user.playlist is an array before filtering
        if (!Array.isArray(user.playlist)) {
            user.playlist = [];
        }

        // Remove the Spotify song ID from the user's playlist
        user.playlist = user.playlist.filter(id => id !== spotifySongId);

        await user.save();
        res.status(200).json({ message: 'Song removed from playlist successfully!', playlist: user.playlist });

    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


module.exports = router;
