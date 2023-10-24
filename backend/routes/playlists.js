const express = require('express');
const Playlist = require('../models/playlist');
const { authenticateJWT, authenticateSpotify } = require('../middleware/auth');  // Changed to Spotify-specific authentication
const mongoose = require('mongoose');
const axios = require('axios'); // Added for making HTTP requests to Spotify API
const router = express.Router();

// Middleware to handle Spotify authentication
router.use(authenticateSpotify);

// Create a new playlist
// Create a new playlist on Spotify
router.post('/create', authenticateSpotify, async (req, res) => {
    try {
        const { name, description, songs } = req.body;
        const userId = req.spotifyUserId;

        // Create playlist on Spotify
        const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: name,
            description: description,
            public: false
        }, {
            headers: {
                'Authorization': `Bearer ${req.session.spotifyAccessToken}` // Include the Spotify access token in the request headers
            }
        });

        const spotifyPlaylistId = response.data.id;

        // Store the Spotify playlist ID in your database
        const newPlaylist = new Playlist({
            name,
            description,
            songs,
            spotifyPlaylistId,
            userId
        });

        await newPlaylist.save();
        res.status(201).json({ message: 'Playlist created successfully!', playlist: newPlaylist });

    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Create a mood-based playlist
router.post('/create-mood-playlist', authenticateSpotify, async (req, res) => {
    try {
        const { mood, artists, playlistName } = req.body;
        const userId = req.spotifyUserId;

        // Use the Spotify API to fetch tracks based on mood and artists
        // ... [logic to fetch tracks]

        // Create playlist on Spotify
        const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: playlistName,
            description: `A ${mood} playlist featuring ${artists.join(', ')}`,
            public: false
        }, {
            headers: {
                'Authorization': `Bearer ${req.session.spotifyAccessToken}`
            }
        });

        const spotifyPlaylistId = response.data.id;

        // Store the Spotify playlist ID in your database
        const newPlaylist = new Playlist({
            name: playlistName,
            description: `A ${mood} playlist featuring ${artists.join(', ')}`,
            songs: [], // Add the fetched songs here
            spotifyPlaylistId,
            userId
        });

        await newPlaylist.save();
        res.status(201).json({ message: 'Mood-based playlist created successfully!', playlist: newPlaylist });

    } catch (error) {
        console.error('Error creating mood-based playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// // Fetch all playlists for a user
// router.get('/', authenticateJWT, async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const playlists = await Playlist.find({ userId });
//         res.status(200).json(playlists);
//     } catch (error) {
//         console.error('Error fetching playlists:', error);
//         res.status(500).json({ message: 'Server error. Please try again later.' });
//     }
// });

// // Update a playlist's details
// router.put('/:playlistId', authenticateJWT, async (req, res) => {
//     try {
//         const { name, description } = req.body;
//         const playlistId = req.params.playlistId;
//         const userId = req.user.id;

//         const playlist = await Playlist.findById(playlistId);
//         if (!playlist) {
//             return res.status(404).json({ message: 'Playlist not found.' });
//         }

//         // Check if the playlist belongs to the authenticated user
//         if (playlist.userId.toString() !== userId) {
//             return res.status(403).json({ message: 'You do not have permission to update this playlist.' });
//         }

//         if (name) playlist.name = name;
//         if (description) playlist.description = description;

//         await playlist.save();
//         res.status(200).json({ message: 'Playlist updated successfully!', playlist });

//     } catch (error) {
//         console.error('Error updating playlist:', error);
//         res.status(500).json({ message: 'Server error. Please try again later.' });
//     }
// });


// // Delete a playlist
// router.delete('/:playlistId', authenticateJWT, async (req, res) => {
//     try {
//         const playlistId = req.params.playlistId;
//         const userId = req.user.id;

//         const playlist = await Playlist.findById(playlistId);
//         if (!playlist) {
//             return res.status(404).json({ message: 'Playlist not found.' });
//         }

//         // Check if the playlist belongs to the authenticated user
//         if (playlist.userId.toString() !== userId) {
//             return res.status(403).json({ message: 'You do not have permission to delete this playlist.' });
//         }

//         await playlist.remove();
//         res.status(200).json({ message: 'Playlist deleted successfully!' });

//     } catch (error) {
//         console.error('Error deleting playlist:', error);
//         res.status(500).json({ message: 'Server error. Please try again later.' });
//     }
// });

// Add songs to a playlist
router.post('/:playlistId/add-songs', authenticateSpotify, async (req, res) => {
    try {
        const songs = req.body.songs; // These should be Spotify track URIs
        const playlistId = req.params.playlistId;

        // Add songs to Spotify playlist
        await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            uris: songs
        });

        // Update local database if necessary
        const playlist = await Playlist.findById(playlistId);
        playlist.songs.push(...songs);
        await playlist.save();

        res.status(200).json({ message: 'Songs added to playlist successfully!', playlist });

    } catch (error) {
        console.error('Error adding songs to playlist:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// // Remove songs from a playlist
// router.post('/:playlistId/remove-songs', authenticateJWT, async (req, res) => {
//     try {
//         const { songs } = req.body;
//         const playlistId = req.params.playlistId;

//         const playlist = await Playlist.findById(playlistId);
//         if (!playlist) {
//             return res.status(404).json({ message: 'Playlist not found.' });
//         }

//         playlist.songs = playlist.songs.filter(songId => !songs.includes(songId));
//         await playlist.save();

//         res.status(200).json({ message: 'Songs removed from playlist successfully!', playlist });

//     } catch (error) {
//         console.error('Error removing songs from playlist:', error);
//         res.status(500).json({ message: 'Server error. Please try again later.' });
//     }
// });

// View a specific playlist
// router.get('/:playlistId', authenticateJWT, async (req, res) => {
//     try {
//         const { playlistId } = req.params;

//         // Fetch the playlist by its ID
//         const playlist = await Playlist.findById(playlistId).populate('songs'); // This will also fetch the song details associated with the playlist

//         if (!playlist) {
//             return res.status(404).json({ message: 'Playlist not found.' });
//         }

//         res.status(200).json(playlist);
//     } catch (error) {
//         console.error('Error fetching the playlist:', error);
//         res.status(500).json({ message: 'Server error. Please try again later.' });
//     }
// });


module.exports = router;
