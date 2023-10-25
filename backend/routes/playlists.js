const express = require('express');
const Playlist = require('../models/playlist');
const { authenticateJWT, authenticateSpotify } = require('../middleware/auth');
const mongoose = require('mongoose');
const axios = require('axios');
const router = express.Router();

// Middleware to handle Spotify authentication
router.use(authenticateSpotify);

// Create a new playlist on Spotify
router.post('/create', authenticateSpotify, async (req, res) => {
    const { playlistName, description } = req.body;
    try {
        const response = await axios.post(`https://api.spotify.com/v1/users/${req.user.spotifyId}/playlists`, {
            name: playlistName,
            description: description
        }, {
            headers: {
                'Authorization': `Bearer ${req.user.spotifyAccessToken}`
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create playlist on Spotify.' });
    }
});

// Fetch user's playlists from Spotify
router.get('/user-playlists', authenticateSpotify, async (req, res) => {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': `Bearer ${req.user.spotifyAccessToken}`
            }
        });
        res.json(response.data.items);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user playlists from Spotify.' });
    }
});

// Add songs to a playlist on Spotify
router.post('/:playlistId/add-songs', authenticateSpotify, async (req, res) => {
    const { trackIds } = req.body;
    try {
        await axios.post(`https://api.spotify.com/v1/playlists/${req.params.playlistId}/tracks`, {
            uris: trackIds.map(id => `spotify:track:${id}`)
        }, {
            headers: {
                'Authorization': `Bearer ${req.user.spotifyAccessToken}`
            }
        });
        res.status(201).json({ message: 'Tracks added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add tracks to the playlist.' });
    }
});

module.exports = router;
