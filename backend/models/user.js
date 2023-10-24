const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        unique: true
    },
    profile: {
        type: Object,
        default: {}
    },
    spotifyAccessToken: {
        type: String,
        default: null
    },
    spotifyRefreshToken: {
        type: String,
        default: null
    },
    spotifyTokenExpiration: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema);
