const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: String,
        required: true,
        trim: true
    },
    album: {
        type: String,
        trim: true
    },
    duration: {
        type: String,
        required: true
    },
    spotifyId: {
        type: String,
        unique: true
    },
    genre: {
        type: String,
        trim: true
    },
    previewUrl: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
