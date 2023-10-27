const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const passport = require('passport');
const { authenticateJWT, authenticateSpotify } = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');
const jwt = require('jsonwebtoken');
const base64 = require('base64-js');
const User = require('../models/user'); // Adjust the path based on your directory structure
const { body, validationResult } = require('express-validator');


const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5000/spotify/callback'  // Updated to point to the backend
});

const handleSpotifyRequest = async (url, accessToken) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Refresh the token here and retry the request
            // Note: You'll need to implement the token refresh logic on the backend as well.
        }
        throw error;
    }
};

router.get('/auth-url', (req, res) => {
    const authUrl = spotifyApi.createAuthorizeURL([
        'user-read-email', 
        'user-read-private', 
        'user-top-read', 
        'playlist-modify-private', 
        'playlist-modify-public',
        'playlist-read-private',
        'playlist-read-collaborative'
    ], 'some-state');
    res.json({ authUrl });
});

router.get('/login', passport.authenticate('spotify', {
    scope: [
        'user-read-email', 
        'user-read-private', 
        'user-top-read', 
        'playlist-modify-private', 
        'playlist-modify-public',
        'playlist-read-private',
        'playlist-read-collaborative'
    ],
    showDialog: true
}));


router.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // Requesting access and refresh tokens from Spotify using the received code
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:5000/spotify/callback',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = response.data;

        // Fetch the user's profile information from Spotify
        const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        const spotifyUserProfile = userProfileResponse.data;

        let user = await User.findOne({ spotifyId: spotifyUserProfile.id });
        
        if (!user) {
            user = new User({
                spotifyId: spotifyUserProfile.id,
                profile: spotifyUserProfile,
                spotifyAccessToken: access_token,
                spotifyRefreshToken: refresh_token,
                spotifyTokenExpiration: new Date(Date.now() + 3600000)
            });
            await user.save();
        } else {
            user.profile = spotifyUserProfile;
            user.spotifyAccessToken = access_token;
            user.spotifyRefreshToken = refresh_token;
            user.spotifyTokenExpiration = new Date(Date.now() + 3600000);
            await user.save();
        }

        // Redirecting to the frontend Spotify page after setting the cookie
        res.redirect(`${FRONTEND_URL}/spotify/process-token?token=${access_token}`);


    } catch (error) {
        console.error('Error in Spotify callback:', error);
        res.status(500).json({ message: 'Failed to authenticate with Spotify.' });
    }
});



router.get('/spotify-token', async (req, res) => {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'client_credentials',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = response.data.access_token;
        res.json({ access_token: accessToken });

    } catch (error) {
        console.error('Error getting Spotify token for non-user:', error);
        res.status(500).json({ message: 'Failed to get Spotify token for non-user.' });
    }
});

router.post('/disconnect', authenticateJWT, (req, res) => {
    res.clearCookie('spotifyAuthToken');
    res.clearCookie('spotifyUserId'); // Clear the Spotify user ID cookie
    res.status(200).json({ message: 'Disconnected from Spotify successfully.' });
});

router.get('/user-top-tracks', authenticateSpotify, async (req, res) => {
    const accessToken = req.user.spotifyAccessToken;
    try {
        const topTracks = await handleSpotifyRequest('https://api.spotify.com/v1/me/top/tracks', accessToken);
        res.json(topTracks);
    } catch (error) {
        console.error('Error fetching user top tracks:', error);
        res.status(500).json({ message: 'Failed to fetch user top tracks from Spotify.' });
    }
});

router.get('/user-playlists', authenticateSpotify, async (req, res) => {
    const accessToken = req.user.spotifyAccessToken;
    try {
        const playlists = await handleSpotifyRequest('https://api.spotify.com/v1/me/playlists', accessToken);
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching user playlists:', error);
        res.status(500).json({ message: 'Failed to fetch user playlists from Spotify.' });
    }
});



router.get('/recommendations', authenticateJWT, async (req, res) => {
    const accessToken = req.user.spotifyAccessToken;
    const genre = req.query.genre;

    try {
        const response = await axios.get(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        res.json(response.data.tracks);

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch recommendations from Spotify.' });
    }
});

router.get('/track-features/:trackId', authenticateJWT, async (req, res) => {
    const accessToken = req.user.spotifyAccessToken;
    const trackId = req.params.trackId;

    try {
        const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error fetching track features:', error);
        res.status(500).json({ message: 'Failed to fetch track features from Spotify.' });
    }
});


router.get('/search', authenticateJWT, async (req, res) => {
    const accessToken = req.user.spotifyAccessToken;
    const query = req.query.q;

    try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track,album,artist`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ message: 'Failed to search Spotify.' });
    }
});

router.post('/create-playlist', 
    authenticateJWT,
    body('playlistName').notEmpty().withMessage('Playlist name is required'),
    body('trackIds').isArray().withMessage('Track IDs should be an array'),
    body('description').notEmpty().withMessage('Description is required'),
    body('public').isBoolean().withMessage('Public should be a boolean value'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const accessToken = req.user.spotifyAccessToken;
        const mongoUserId = req.user.userId; 
        const { playlistName, trackIds, description, public: isPublic } = req.body;

        try {
            const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${mongoUserId}/playlists`, {
                name: playlistName,
                description: description,
                public: isPublic
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            const playlistId = playlistResponse.data.id;

            await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                uris: trackIds.map(id => `spotify:track:${id}`)
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            res.status(201).json({ message: 'Playlist created successfully!', playlistId });

        } catch (error) {
            console.error('Error creating playlist:', error);
            res.status(500).json({ message: 'Failed to create playlist on Spotify.', error: error.message });
        }
    }
);

router.get('/mood-playlist', authenticateJWT, async (req, res) => {
    const accessToken = req.user.spotifyAccessToken;
    const mood = req.query.mood;
    const intensity = req.query.intensity;

    try {
        // Determine the audio features based on mood and intensity
        const audioFeatures = determineAudioFeatures(mood, intensity);

        // Fetch track recommendations based on audio features
        const recommendations = await axios.get('https://api.spotify.com/v1/recommendations', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params: {
                limit: 20, // You can adjust the number of tracks you want
                target_danceability: audioFeatures.danceability,
                target_energy: audioFeatures.energy,
                target_valence: audioFeatures.valence,
                // Add more audio features as needed
            }
        });

        res.json(recommendations.data.tracks);

    } catch (error) {
        console.error('Error fetching mood playlist:', error);
        res.status(500).json({ message: 'Failed to fetch mood playlist from Spotify.' });
    }
});

function determineAudioFeatures(mood, intensity) {
    // Logic to determine audio features based on mood and intensity
    const features = {
        danceability: 0.5,
        energy: 0.5,
        valence: 0.5
    };

    switch (mood) {
        case 'Happy':
            features.valence = intensity / 100;
            break;
        case 'Sad':
            features.valence = 1 - (intensity / 100);
            break;
        case 'Energetic':
            features.energy = intensity / 100;
            break;
        case 'Calm':
            features.energy = 1 - (intensity / 100);
            break;
        // Add more moods as needed
    }

    return features;
}

router.post('/refresh-token', authenticateJWT, async (req, res) => {
    const refreshToken = req.user.spotifyRefreshToken;
    const mongoUserId = req.user.userId;

    try {
        const credentials = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
        const encodedCredentials = base64.fromByteArray(Buffer.from(credentials));

        const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${encodedCredentials}`
            }
        });

        const newAccessToken = response.data.access_token;
        const expiresIn = response.data.expires_in * 1000; // Convert to milliseconds

        // Update the user's database record with the new access token
        await User.findOneAndUpdate({ _id: mongoUserId }, {
            spotifyAccessToken: newAccessToken,
            spotifyTokenExpiration: new Date(Date.now() + expiresIn)
        });

        res.json({ access_token: newAccessToken });

    } catch (error) {
        console.error('Error refreshing Spotify token:', error);
        res.status(500).json({ message: 'Failed to refresh Spotify token.', details: error.message });
    }
});


module.exports = router;
