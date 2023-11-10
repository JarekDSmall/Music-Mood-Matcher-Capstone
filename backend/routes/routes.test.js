require('dotenv').config();
const request = require('supertest');
const { app } = require('../index.js');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../utils/spotify');

if (!app) {
    throw new Error("Failed to import 'app' from '../index.js'. Ensure it's correctly exported.");
}

// Start the server for testing
const server = app.listen();
const agent = request.agent(server);

// Mocking Axios calls
jest.mock('axios', () => ({
    post: jest.fn((url) => {
        if (url === 'https://accounts.spotify.com/api/token') {
            return Promise.resolve({
                data: {
                    access_token: 'mockAccessToken',
                    token_type: 'Bearer',
                    expires_in: 3600,
                },
            });
        }
        return Promise.reject(new Error('URL not mocked'));
    }),
    get: jest.fn(() => Promise.reject(new Error('URL not mocked'))),
}));

// Mock the authentication middleware to simulate an unauthorized user
jest.mock('../middleware/auth', () => ({
    authenticateJWT: jest.fn((req, res, next) => next()),
    authenticateSpotify: jest.fn((req, res, next) => {
        res.status(401).json({ error: 'Authentication required' });
    }),
}));

describe('Spotify Routes and Utility Function Tests', () => {


    it('should return an access token on successful request', async () => {
        const token = await getSpotifyAccessToken();
        expect(token).toBe('mockAccessToken');
    });

    it('should return null on failed request', async () => {
        axios.post.mockImplementationOnce(() => Promise.reject(new Error('Request failed')));
        const token = await getSpotifyAccessToken();
        expect(token).toBeNull();
    });
});

describe('User Playlist Access', () => {
    it('should prevent access to user playlists without Spotify API info', async () => {
        const response = await agent.get('/spotify/user-playlists');
        
        // Check if the status code is 401 Unauthorized
        expect(response.statusCode).toBe(401);
        
        // Check if the response body contains the error message
        expect(response.body).toEqual({
          error: "Authentication required"
        });
      });
});

  

afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
});
