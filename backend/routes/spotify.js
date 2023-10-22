const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const passport = require('passport');
const authenticateJWT = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');
const jwt = require('jsonwebtoken');
const base64 = require('base64-js');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5000/spotify/callback'  // Updated to point to the backend
});

router.get('/auth-url', (req, res) => {
    const authUrl = spotifyApi.createAuthorizeURL([
        'user-read-private', 
        'user-read-email', 
        'user-top-read', 
        'playlist-modify-private', 
        'playlist-modify-public'
    ], 'some-state');
    res.json({ authUrl });
});

router.get('/login', passport.authenticate('spotify', {
    scope: [
        'user-read-email', 
        'user-read-private', 
        'user-top-read', 
        'playlist-modify-private', 
        'playlist-modify-public'
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
            redirect_uri: 'http://localhost:5000/spotify/callback',  // Updated to point to the backend
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const { access_token, refresh_token } = response.data;

        // Generating a JWT token using the received access and refresh tokens
        const token = jwt.sign({ spotifyAccessToken: access_token, spotifyRefreshToken: refresh_token }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Setting the JWT token as a cookie
        res.cookie('spotifyAuthToken', token, {
            httpOnly: true,
            secure: true,  // Ensure this is set to true if your application uses HTTPS
            maxAge: 3600000,  // 1 hour in milliseconds
            sameSite: 'strict'  // This setting can help prevent CSRF attacks
        });

        // Redirecting to the frontend dashboard after setting the cookie
        res.redirect(`${FRONTEND_URL}/dashboard`);

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
    res.status(200).json({ message: 'Disconnected from Spotify successfully.' });
});

router.get('/top-tracks', authenticateJWT, async (req, res) => {
    console.log(`[INFO] Incoming request to /top-tracks from ${req.ip}`);

    const accessToken = req.user.spotifyAccessToken;
    const refreshToken = req.user.spotifyRefreshToken;

    try {
        console.log('[INFO] Fetching top tracks from Spotify...');
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const topTracks = response.data.items;
        console.log('[INFO] Successfully fetched top tracks from Spotify.');
        res.json(topTracks);

    } catch (error) {
        console.error('[ERROR] Error fetching top tracks:', error);

        if (error.response && error.response.status === 401) {
            console.warn('[WARN] Spotify token expired. Attempting to refresh...');
            
            try {
                const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: process.env.SPOTIFY_CLIENT_ID,
                    client_secret: process.env.SPOTIFY_CLIENT_SECRET
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const newAccessToken = response.data.access_token;
                console.log('[INFO] Successfully refreshed Spotify token.');

                console.log('[INFO] Retrying top tracks request with new token...');
                const retryResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
                    headers: {
                        'Authorization': `Bearer ${newAccessToken}`
                    }
                });

                res.json(retryResponse.data.items);
                console.log('[INFO] Successfully fetched top tracks with refreshed token.');

            } catch (refreshError) {
                console.error('[ERROR] Error refreshing Spotify token:', refreshError);
                res.status(500).json({ message: 'Failed to refresh Spotify token.' });
            }
        } else {
            res.status(500).json({ message: 'Failed to fetch top tracks from Spotify.' });
        }
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

router.post('/create-playlist', authenticateJWT, async (req, res) => {
    const accessToken = req.user.spotifyAccessToken;
    const userId = req.user.id;
    const { playlistName, trackIds } = req.body;

    try {
        const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: playlistName
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
        res.status(500).json({ message: 'Failed to create playlist on Spotify.' });
    }
});

router.post('/refresh-token', authenticateJWT, async (req, res) => {
    const refreshToken = req.user.spotifyRefreshToken;

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
        res.json({ access_token: newAccessToken });

    } catch (error) {
        console.error('Error refreshing Spotify token:', error);
        res.status(500).json({ message: 'Failed to refresh Spotify token.' });
    }
});

module.exports = router;
