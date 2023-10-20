const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const passport = require('passport');  // Import passport
const authenticateJWT = require('../middleware/auth');
const SpotifyWebApi = require('spotify-web-api-node');
const jwt = require('jsonwebtoken');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const router = express.Router();

// Initialize the spotifyApi object
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:5000/spotify/callback'
});



// Endpoint to generate the Spotify authorization URL
router.get('/auth-url', (req, res) => {
    const authUrl = spotifyApi.createAuthorizeURL(['user-read-private', 'user-read-email'], 'some-state');
    res.json({ authUrl });
});

// Route to initiate OAuth2.0 flow with Spotify
router.get('/login', passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'user-top-read'],
    showDialog: true  // This ensures that the user always sees the Spotify login prompt, useful during development/testing
}));

router.get('/callback', async (req, res) => {
    console.log("Callback endpoint hit"); 
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

        // Create a JWT token for the user
        const token = jwt.sign({ spotifyAccessToken: access_token, spotifyRefreshToken: refresh_token }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('spotifyAuthToken', access_token, { httpOnly: true, sameSite: 'strict', maxAge: 3600000 }); // 1 hour expiration

        res.redirect(`${FRONTEND_URL}/spotify-dashboard?token=${token}`);


    } catch (error) {
        console.error('Error in Spotify callback:', error);
        res.status(500).json({ message: 'Failed to authenticate with Spotify.' });
    }
});

router.get('/spotify-token', async (req, res) => {
    console.log("Attempting to access /spotify-token");
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


// "Logout" or "disconnect" from Spotify in your app
router.post('/disconnect', authenticateJWT, (req, res) => {
    // Remove the stored tokens for the user.
    // TODO: Implement database logic to remove tokens

    res.clearCookie('spotifyAuthToken'); // Clear the Spotify authentication cookie
    res.status(200).json({ message: 'Disconnected from Spotify successfully.' });
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
