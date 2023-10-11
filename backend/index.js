const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');  // Importing the CORS package

// Import the models
const User = require('./models/user');
const Playlist = require('./models/playlist');
const Song = require('./models/song');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());  // For parsing JSON request bodies
app.use(express.urlencoded({ extended: true }));  // For parsing URL-encoded request bodies
app.use(cors());  // Enabling CORS for all routes and origins

// Connect to MongoDB using Mongoose
mongoose.connect('YOUR_MONGODB_CONNECTION_STRING', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
