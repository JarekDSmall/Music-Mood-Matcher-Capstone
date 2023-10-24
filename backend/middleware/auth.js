const jwt = require('jsonwebtoken');
const axios = require('axios');

function authenticateJWT(req, res, next) {
    const token = req.cookies.spotifyAuthToken;

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

async function authenticateSpotify(req, res, next) {
    try {
        // Retrieve the Spotify access token from the request header or session
        const spotifyAccessToken = req.headers['spotify-access-token'] || req.session.spotifyAccessToken;

        if (!spotifyAccessToken) {
            return res.status(401).json({ message: 'Spotify access token is missing.' });
        }

        // Verify the access token with Spotify
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${spotifyAccessToken}`
            }
        });

        // If successful, attach the Spotify user ID to the request object
        req.spotifyUserId = response.data.id;

        next();
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Handle expired or invalid token
            return res.status(401).json({ message: 'Spotify access token is expired or invalid.' });
        }
        console.error('Error authenticating with Spotify:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

module.exports = {
    authenticateJWT,
    authenticateSpotify
};
