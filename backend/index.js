require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

// Load the models first
require('./models/song');
require('./models/playlist');
require('./models/user');

// Import the routes
const playlistRoutes = require('./routes/playlists');
const spotifyRoutes = require('./routes/spotify');
const moodsRoutes = require('./routes/moods');
const moodRoutes = require('./routes/mood');
const genresRoutes = require('./routes/genres');

const app = express();

// Add morgan middleware for logging
app.use(morgan('combined'));
let server;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// If in test environment, use the bypass middleware
const bypassSpotifyAuthForTesting = require('./middleware/testing'); 
if (process.env.NODE_ENV === 'test') {
    app.use(bypassSpotifyAuthForTesting);
}

// Setup express-session with connect-mongo
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Spotify Strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/spotify/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      // Store accessToken in session
      profile.accessToken = accessToken;
      return done(null, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Connect to MongoDB using Mongoose
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

// Call the connectToDatabase function
connectToDatabase();

// Redirect to Client with Tokens
app.get('/spotify/redirect', (req, res) => {
    const accessToken = req.user.accessToken;
    res.redirect(`http://localhost:3000/?accessToken=${accessToken}`);
});

// Use the routes
// app.use('/users', userRoutes);
app.use('/playlists', playlistRoutes);
app.use('/spotify', spotifyRoutes);
app.use('/moods', moodsRoutes);
app.use('/api/mood', moodRoutes);
app.use('/genres', genresRoutes);


if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = { app, server };
