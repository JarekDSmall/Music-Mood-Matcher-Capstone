// const express = require('express');
// const router = express.Router();
// const Mood = require('../models/Mood');

// // Endpoint to get all moods from the database
// router.get('/moods', async (req, res) => {
//     try {
//         const moods = await Mood.find();
//         res.json(moods);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch moods.' });
//     }
// });

// router.post('/moods', async (req, res) => {
//     const { name, description } = req.body;
//     try {
//         const mood = new Mood({ name, description });
//         await mood.save();
//         res.status(201).json(mood);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to create mood.' });
//     }
// });

// // ... Add PUT and DELETE routes as needed

// module.exports = router;
