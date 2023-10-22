const express = require('express');
const Playlist = require('../models/playlist');
const authenticateJWT = require('../middleware/auth');
const mongoose = require('mongoose');
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

// Fetch all playlists for a user
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const userId = req.user.id;
        const playlists = await Playlist.find({ userId });
        res.status(200).json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Update a playlist's details
router.put('/:playlistId', authenticateJWT, async (req, res) => {
    try {
        const { name, description } = req.body;
        const playlistId = req.params.playlistId;
        const userId = req.user.id;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        // Check if the playlist belongs to the authenticated user
        if (playlist.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have permission to update this playlist.' });
        }

        if (name) playlist.name = name;
        if (description) playlist.description = description;

        await playlist.save();
        res.status(200).json({ message: 'Playlist updated successfully!', playlist });

    } catch (error) {
        console.error('Error updating playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


// Delete a playlist
router.delete('/:playlistId', authenticateJWT, async (req, res) => {
    try {
        const playlistId = req.params.playlistId;

        const result = await Playlist.findByIdAndDelete(playlistId);
        if (!result) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        res.status(200).json({ message: 'Playlist deleted successfully!' });

    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Add songs to a playlist
router.post('/:playlistId/add-songs', authenticateJWT, async (req, res) => {
    try {
        const songs = req.body.songs;
        const playlistId = req.params.playlistId;

        // Check if songs is an array
        if (!Array.isArray(songs)) {
            return res.status(400).json({ message: 'Invalid songs format. Expected an array of song IDs.' });
        }

        // Validate each song ID
        for (let songId of songs) {
            if (!mongoose.Types.ObjectId.isValid(songId)) {
                return res.status(400).json({ message: `Invalid song ID: ${songId}` });
            }
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        // Add songs to the playlist
        playlist.songs.push(...songs);
        await playlist.save();

        res.status(200).json({ message: 'Songs added to playlist successfully!', playlist });

    } catch (error) {
        console.error('Error adding songs to playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Remove songs from a playlist
router.post('/:playlistId/remove-songs', authenticateJWT, async (req, res) => {
    try {
        const { songs } = req.body;
        const playlistId = req.params.playlistId;

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        playlist.songs = playlist.songs.filter(songId => !songs.includes(songId));
        await playlist.save();

        res.status(200).json({ message: 'Songs removed from playlist successfully!', playlist });

    } catch (error) {
        console.error('Error removing songs from playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// View a specific playlist
router.get('/:playlistId', authenticateJWT, async (req, res) => {
    try {
        const { playlistId } = req.params;

        // Fetch the playlist by its ID
        const playlist = await Playlist.findById(playlistId).populate('songs'); // This will also fetch the song details associated with the playlist

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found.' });
        }

        res.status(200).json(playlist);
    } catch (error) {
        console.error('Error fetching the playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});


module.exports = router;
