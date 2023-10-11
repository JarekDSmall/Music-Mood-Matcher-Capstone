const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    songs: {
        type: Array,
        default: []
    },
    mood: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Playlist', playlistSchema);
