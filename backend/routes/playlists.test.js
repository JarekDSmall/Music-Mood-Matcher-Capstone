const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../index.js');

const server = app.listen();
const agent = request.agent(server);

// Mocking the authenticateSpotify middleware
jest.mock('../middleware/auth', () => ({
    authenticateSpotify: (req, res, next) => {
        req.spotifyUserId = 'someSpotifyUserId'; // Mocked Spotify user ID
        next();
    },
    authenticateJWT: (req, res, next) => {
        next(); // Just call next() to move to the next middleware or route handler
    }
}));

describe('Playlists Routes', () => {

    // Test for creating a new playlist
    it('should create a new playlist', async () => {
        const playlistData = {
            name: 'Test Playlist',
            description: 'This is a test playlist',
            songs: ['song1', 'song2']
        };

        const response = await agent
            .post('/playlists/create')
            .send(playlistData);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Playlist created successfully!');
        expect(response.body.data.name).toBe(playlistData.name);
        expect(response.body.data.description).toBe(playlistData.description);
        expect(response.body.data.songs).toEqual(playlistData.songs);
    });

    // Test for creating a mood-based playlist
    it('should create a mood-based playlist', async () => {
        const moodData = {
            mood: 'happy',
            artists: ['Ariana Grande', 'Taylor Swift'],
            playlistName: 'My Happy Vibes'
        };

        const response = await agent
            .post('/playlists/create-mood-playlist')
            .send(moodData);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe('Mood-based playlist created successfully!');
        expect(response.body.data.name).toBe(moodData.playlistName);
        expect(response.body.data.songs).toBeDefined();
    });

    // ... [rest of your existing tests]

});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => server.close(resolve));
});
