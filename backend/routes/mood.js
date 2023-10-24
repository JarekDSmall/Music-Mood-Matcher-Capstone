const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/mood/:trackId', async (req, res) => {
    const trackId = req.params.trackId;
    const accessToken = req.user.spotifyAccessToken; // Assuming you have user's Spotify access token stored in req.user

    try {
        const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const features = response.data;
        const mood = determineMood(features);

        res.json({ mood });

    } catch (error) {
        console.error('Error fetching track features:', error);
        res.status(500).json({ message: 'Failed to fetch track features from Spotify.' });
    }
});

function determineMood(features) {
    if (features.valence > 0.7) {
        return 'Happy';
    } else if (features.valence < 0.3) {
        return 'Sad';
    }
    return 'Neutral';
}

router.get('/recommendations', async (req, res) => {
    const mood = req.query.mood;
    const accessToken = req.user.spotifyAccessToken;

    try {
        const seedTracks = getSeedTracksForMood(mood);
        const response = await axios.get(`https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks.join(',')}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const recommendations = response.data.tracks;
        res.json(recommendations);

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch recommendations from Spotify.' });
    }
});

function getSeedTracksForMood(mood) {
    const moodTracks = {
        'Happy': ['trackId1', 'trackId2'],
        'Sad': ['trackId3', 'trackId4'],
    };
    return moodTracks[mood] || [];
}

module.exports = router;
