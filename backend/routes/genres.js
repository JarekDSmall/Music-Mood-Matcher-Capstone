const express = require('express');
const router = express.Router();

// Sample genres data (you can replace this with data from your database)
const genres = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Country', 'Electronic'];

// Endpoint to get all genres
router.get('/', (req, res) => {
    res.status(200).json(genres);
});

module.exports = router;
