const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

// Import the routes
const userRoutes = require('./routes/users');
const songRoutes = require('./routes/songs');       // Import song routes
const playlistRoutes = require('./routes/playlists'); // Import playlist routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://smalljarek:tymWxGTQs4Cq7qP3@cluster0.oyry4to.mongodb.net/moodMatcher?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Use the routes
app.use('/users', userRoutes);
app.use('/songs', songRoutes);       // Use song routes
app.use('/playlists', playlistRoutes); // Use playlist routes

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
