require('dotenv').config();
const request = require('supertest');
const { app, connectToDatabase } = require('../index.js'); // Adjust the path as necessary
const axios = require('axios');

const server = app.listen();
const agent = request.agent(server);

jest.mock('axios');

beforeAll(async () => {
    await connectToDatabase();
});

describe('Mood Route', () => {

    it('GET /api/mood/recommendations - get recommendations based on mood', async () => {
        const mockRecommendations = [{ id: 'trackId1' }, { id: 'trackId2' }];
        axios.get.mockResolvedValue({ data: { tracks: mockRecommendations } });

        // Mock the user object and spotifyAccessToken if your route requires it
        // This is just an example, adjust according to your actual implementation
        const mockUser = {
            spotifyAccessToken: 'mocked_spotify_access_token'
        };

        app.use((req, res, next) => {
            req.user = mockUser;
            next();
        });

        const response = await agent
            .get('/api/mood/recommendations?mood=Happy') // Updated route
            .set('Authorization', `Bearer ${mockUser.spotifyAccessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockRecommendations);
    });
});

afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
});