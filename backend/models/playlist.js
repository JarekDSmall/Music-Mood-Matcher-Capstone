const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    mood: {
        type: String,
        trim: true
    },
    spotifyId: {
        type: String,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    public: {
        type: Boolean,
        default: false
    }
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
