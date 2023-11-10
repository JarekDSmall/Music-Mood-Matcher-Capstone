require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { app, connectToDatabase } = require('../index.js');
const axios = require('axios');
const bypassSpotifyAuthForTesting = require('../middleware/testing'); // Make sure this path is correct

// Mock the actual authentication middlewares
jest.mock('../middleware/auth', () => ({
  authenticateJWT: (req, res, next) => {
    req.user = { id: 'mocked_user_id' }; // Mock user object as it would be set by the actual middleware
    next();
  },
  authenticateSpotify: (req, res, next) => {
    req.spotifyUserId = 'mocked_spotify_user_id'; // Mock Spotify user ID as it would be set by the actual middleware
    next();
  }
}));

const server = app.listen();
const agent = request.agent(server);

jest.mock('axios');

beforeAll(async () => {
    app.use(bypassSpotifyAuthForTesting); // Apply the bypass middleware
    await connectToDatabase();
});

describe('Playlists Route', () => {
    it('POST /create - create a new playlist', async () => {
        const mockPlaylistData = { name: 'Chill Vibes', description: 'A playlist for relaxing' };
        axios.post.mockResolvedValue({ data: mockPlaylistData });

        const response = await agent
            .post('/playlists/create')
            .send(mockPlaylistData)
            .set('Authorization', 'Bearer mocked_spotify_access_token');

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(mockPlaylistData);
    });

    it('GET /user-playlists - fetch user playlists', async () => {
        const mockPlaylists = [{ id: 1, name: 'Workout' }, { id: 2, name: 'Study' }];
        axios.get.mockResolvedValue({ data: { items: mockPlaylists } });

        const response = await agent
            .get('/playlists/user-playlists')
            .set('Authorization', 'Bearer mocked_spotify_access_token');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockPlaylists);
    });

    it('POST /:playlistId/add-songs - add songs to playlist', async () => {
        const mockTrackIds = ['trackId1', 'trackId2'];
        axios.post.mockResolvedValue({});

        const response = await agent
            .post('/playlists/1/add-songs')
            .send({ trackIds: mockTrackIds })
            .set('Authorization', 'Bearer mocked_spotify_access_token');

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual('Tracks added successfully!');
    });
});

afterAll(async () => {
    await mongoose.disconnect(); // Disconnect from mongoose
    await new Promise(resolve => server.close(resolve));
});
