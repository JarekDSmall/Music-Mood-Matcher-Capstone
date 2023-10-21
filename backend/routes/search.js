const express = require('express');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../utils/spotify');

const router = express.Router();

router.get('/search', async (req, res) => {
    const query = req.query.q; // Assuming the frontend sends the search query as a "q" parameter
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
        return res.status(500).json({ error: 'Failed to fetch Spotify access token' });
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error searching Spotify:', error);
        res.status(500).json({ error: 'Failed to search Spotify' });
    }
});

module.exports = router;
