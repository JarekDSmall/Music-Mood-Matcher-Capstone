const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotifyId: {
        type: String,
        unique: true
    },
    displayName: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    followersCount: {
        type: Number,
        default: 0
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
