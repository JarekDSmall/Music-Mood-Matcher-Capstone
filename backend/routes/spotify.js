const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const passport = require('passport');
const { authenticateJWT } = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');
const jwt = require('jsonwebtoken');
const base64 = require('base64-js');
const User = require('../models/user'); // Adjust the path based on your directory structure


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

        const spotifyUserId = userProfileResponse.data.id;
        res.cookie('spotifyUserId', spotifyUserId, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            sameSite: 'strict'
        });

        let user = await User.findOne({ spotifyId: spotifyUserId });

        if (!user) {
            // If user doesn't exist, create a new user
            user = new User({
                spotifyId: spotifyUserId,
                spotifyAccessToken: access_token,
                spotifyRefreshToken: refresh_token,
                spotifyTokenExpiration: new Date(Date.now() + 3600000)
            });
            await user.save();
        } else {
            // If user exists, update their tokens
            user.spotifyAccessToken = access_token;
            user.spotifyRefreshToken = refresh_token;
            user.spotifyTokenExpiration = new Date(Date.now() + 3600000);
            await user.save();
        }

        const mongoUserId = user._id;  // <-- Change this line

        // Generating a JWT token using the received access and refresh tokens and the MongoDB userId
        const token = jwt.sign({ spotifyAccessToken: access_token, spotifyRefreshToken: refresh_token, userId: mongoUserId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Setting the JWT token as a cookie
        res.cookie('spotifyAuthToken', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
            sameSite: 'strict'
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
    res.clearCookie('spotifyUserId'); // Clear the Spotify user ID cookie
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
    const mongoUserId = req.user.userId; // Use MongoDB userId
    const { playlistName, trackIds, description, public: isPublic } = req.body; // Renamed "public" to "isPublic" to avoid naming conflict

    console.log(playlistName, description, isPublic);

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
        res.status(500).json({ message: 'Failed to create playlist on Spotify.' });
    }
});


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

        // Update the user's database record with the new access token
        await User.findOneAndUpdate({ _id: mongoUserId }, {
            spotifyAccessToken: newAccessToken,
            spotifyTokenExpiration: new Date(Date.now() + 3600000) // Assuming the token expires in 1 hour
        });

        res.json({ access_token: newAccessToken });

    } catch (error) {
        console.error('Error refreshing Spotify token:', error);
        res.status(500).json({ message: 'Failed to refresh Spotify token.' });
    }
});


module.exports = router;
