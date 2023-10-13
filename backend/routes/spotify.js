const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const passport = require('passport');  // Import passport
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

// Route to initiate OAuth2.0 flow with Spotify
router.get('/login', passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'user-top-read'],
    showDialog: true  // This ensures that the user always sees the Spotify login prompt, useful during development/testing
}));

router.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
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

        // Store the access_token and refresh_token for the user in the database
        // TODO: Implement database logic to store tokens

        res.json({ access_token, refresh_token });

    } catch (error) {
        console.error('Error in Spotify callback:', error);
        res.status(500).json({ message: 'Failed to authenticate with Spotify.' });
    }
});

router.get('/top-tracks', authenticateJWT, async (req, res) => {
    const accessToken = req.user.spotifyAccessToken;
    const refreshToken = req.user.spotifyRefreshToken;

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const topTracks = response.data.items;
        res.json(topTracks);

    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, try to refresh it
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

                // Update the user's JWT or database entry with the new access token
                // TODO: Implement database logic to update token

                // Retry the original request with the new token
                const retryResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
                    headers: {
                        'Authorization': `Bearer ${newAccessToken}`
                    }
                });

                res.json(retryResponse.data.items);

            } catch (refreshError) {
                console.error('Error refreshing Spotify token:', refreshError);
                res.status(500).json({ message: 'Failed to refresh Spotify token.' });
            }
        } else {
            console.error('Error fetching top tracks:', error);
            res.status(500).json({ message: 'Failed to fetch top tracks from Spotify.' });
        }
    }
});

// "Logout" or "disconnect" from Spotify in your app
router.post('/disconnect', authenticateJWT, (req, res) => {
    // Remove the stored tokens for the user.
    // TODO: Implement database logic to remove tokens

    res.status(200).json({ message: 'Disconnected from Spotify successfully.' });
});

// Route to refresh the Spotify access token using the refresh token
router.post('/refresh-token', authenticateJWT, async (req, res) => {
    const refreshToken = req.user.spotifyRefreshToken;

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

        // Update the user's database entry with the new access token
        // TODO: Implement database logic to update token

        res.json({ access_token: newAccessToken });

    } catch (error) {
        console.error('Error refreshing Spotify token:', error);
        res.status(500).json({ message: 'Failed to refresh Spotify token.' });
    }
});

module.exports = router;
