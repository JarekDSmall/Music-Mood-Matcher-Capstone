const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    songId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Song', songSchema);
