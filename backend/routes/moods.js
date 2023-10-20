const express = require('express');
const router = express.Router();

// Sample moods data (you can replace this with data from your database)
const moods = ['Happy', 'Sad', 'Energetic', 'Relaxed', 'Romantic', 'Angry'];

// Endpoint to get all moods
router.get('/', (req, res) => {
    res.status(200).json(moods);
});

module.exports = router;
