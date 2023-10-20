require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Load the models first
require('./models/song');
require('./models/playlist');
require('./models/user');

// Import the routes
const userRoutes = require('./routes/users');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlists');
const spotifyRoutes = require('./routes/spotify');
const moodsRoutes = require('./routes/moods');
const genresRoutes = require('./routes/genres');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Use the routes
app.use('/users', userRoutes);
app.use('/songs', songRoutes);
app.use('/playlists', playlistRoutes);
app.use('/spotify', spotifyRoutes);
app.use('/moods', moodsRoutes);
app.use('/genres', genresRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
