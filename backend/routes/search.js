// routes/search.js

const express = require('express');
const axios = require('axios');
const { getClientCredentialsToken } = require('../utils/spotify');

const router = express.Router();

router.get('/tracks', async (req, res) => {
    const query = req.query.q;
    const token = await getClientCredentialsToken();

    try {
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        res.json(response.data.tracks.items);
    } catch (error) {
        console.error('Error searching for tracks:', error);
        res.status(500).json({ message: 'Failed to search tracks.' });
    }
});

module.exports = router;
