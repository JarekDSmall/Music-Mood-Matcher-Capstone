require('dotenv').config();
const request = require('supertest');
const { app } = require('../index.js');
const axios = require('axios');
const { getSpotifyAccessToken } = require('../utils/spotify');
const { authenticateJWT, authenticateSpotify } = require('../middleware/auth')
const express = require('express');

if (!app) {
    throw new Error("Failed to import 'app' from '../index.js'. Ensure it's correctly exported.");
}

const server = app.listen();
const agent = request.agent(server);

// Mocking the Spotify routes
const mockRouter = express.Router();

// Mock user data middleware
mockRouter.use((req, res, next) => {
    req.user = {
        spotifyAccessToken: 'mocked_token',
        spotifyRefreshToken: 'mocked_refresh_token',
        // ... any other required user properties
    };
    next();
});

mockRouter.get('/auth-url', (req, res) => {
    try {
        res.status(200).json({ authUrl: 'mockAuthUrl' });
    } catch (error) {
        console.error('Error in /auth-url:', error);
        res.status(500).send('Internal Server Error');
    }
});

mockRouter.get('/spotify-token', (req, res) => {
    try {
        res.status(200).json({ access_token: 'mockAccessToken' });
    } catch (error) {
        console.error('Error in /spotify-token:', error);
        res.status(500).send('Internal Server Error');
    }
});
mockRouter.get('/user-top-tracks', (req, res) => res.status(200).json({ items: ['track1', 'track2'] }));
mockRouter.get('/user-playlists', (req, res) => res.status(200).json({ items: ['playlist1', 'playlist2'] }));
mockRouter.get('/recommendations', (req, res) => {
    try {
        res.status(200).json({ tracks: ['track1', 'track2'] });
    } catch (error) {
        console.error('Error in /recommendations:', error);
        res.status(500).send('Internal Server Error');
    }
});

mockRouter.get('/track-features/:trackId', (req, res) => {
    try {
        res.status(200).json({ danceability: 0.8, energy: 0.6 });
    } catch (error) {
        console.error('Error in /track-features/:trackId:', error);
        res.status(500).send('Internal Server Error');
    }
});

mockRouter.get('/search', (req, res) => {
    try {
        res.status(200).json({ tracks: { items: ['track1', 'track2'] } });
    } catch (error) {
        console.error('Error in /search:', error);
        res.status(500).send('Internal Server Error');
    }
});

mockRouter.post('/create-playlist', (req, res) => {
    try {
        console.log('Mock /create-playlist hit with data:', req.body);
        res.status(201).json({ id: 'mockPlaylistId', message: 'Playlist created successfully!' });
    } catch (error) {
        console.error('Error in mock /create-playlist:', error);
        res.status(500).send('Internal Server Error');
    }
});

mockRouter.post('/refresh-token', (req, res) => res.status(200).json({ access_token: 'newMockAccessToken' }));

jest.doMock('../routes/spotify', () => mockRouter);

jest.mock('../middleware/auth', () => ({
    authenticateJWT: (req, res, next) => next(),
    authenticateSpotify: (req, res, next) => next()
})
);

// Mocking Axios for getSpotifyAccessToken tests
jest.mock('axios');

axios.post.mockImplementation((url, data, config) => {
    if (url === 'https://accounts.spotify.com/api/token') {
        return Promise.resolve({
            data: {
                access_token: 'mockAccessToken',
                token_type: 'Bearer',
                expires_in: 3600
            }
        });
    }
    if (url.includes('https://api.spotify.com/v1/users/')) {
        return Promise.resolve({
            data: {
                id: 'mockPlaylistId'
            }
        });
    }
    if (url.includes('https://api.spotify.com/v1/playlists/')) {
        return Promise.resolve({
            data: {}
        });
    }
    console.error('Axios post to unmocked URL:', url);
    return Promise.reject(new Error('URL not mocked'));
});

axios.get.mockImplementation((url, config) => {
    if (url.includes('https://api.spotify.com/v1/me')) {
        return Promise.resolve({ data: { /* mock user data */ } });
    }
    if (url.includes('https://api.spotify.com/v1/recommendations')) {
        return Promise.resolve({ data: { tracks: ['track1', 'track2'] } });
    }
    if (url.includes('https://api.spotify.com/v1/audio-features/')) {
        return Promise.resolve({ data: { danceability: 0.8, energy: 0.6 } });
    }
    if (url.includes('https://api.spotify.com/v1/search')) {
        return Promise.resolve({ data: { tracks: { items: ['track1', 'track2'] } } });
    }
    return Promise.reject(new Error('URL not mocked'));
});

describe('Spotify Routes Logic Tests', () => {

    it('should handle the Spotify authentication URL correctly', async () => {
        const response = await agent.get('/spotify/auth-url');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('authUrl');
    });

    it('should handle the Spotify token correctly', async () => {
        const response = await agent.get('/spotify/spotify-token');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('access_token');
    });

    it('should handle user top tracks correctly', async () => {
        const response = await agent.get('/spotify/user-top-tracks');
        expect(response.statusCode).toBe(200);
    });

    it('should handle user playlists correctly', async () => {
        const response = await agent.get('/spotify/user-playlists');
        expect(response.statusCode).toBe(200);
    });

    it('should handle recommendations based on genre correctly', async () => {
        const response = await agent.get('/spotify/recommendations?genre=rock');
        expect(response.statusCode).toBe(200);
    });

    it('should handle fetching track features correctly', async () => {
        const trackId = 'someTrackId';
        const response = await agent.get(`/spotify/track-features/${trackId}`);
        expect(response.statusCode).toBe(200);
    });

    it('should handle Spotify search correctly', async () => {
        const query = 'Imagine Dragons';
        const response = await agent.get(`/spotify/search?q=${query}`);
        expect(response.statusCode).toBe(200);
    });

    it('should handle creating a new playlist correctly', async () => {
        const playlistData = {
            playlistName: 'Test Playlist',
            trackIds: ['track1', 'track2'],
            description: 'Test Description',
            public: true
        };
        const response = await agent.post('/spotify/create-playlist').send(playlistData);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('message', 'Playlist created successfully!');
    });

    it('should handle refreshing the Spotify token correctly', async () => {
        const response = await agent.post('/spotify/refresh-token');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('access_token');
    });

    describe('getSpotifyAccessToken Utility Function', () => {
        it('should return an access token on successful request', async () => {
            const token = await getSpotifyAccessToken();
            expect(token).toBe('mockAccessToken');
        });
    
        it('should return null on failed request', async () => {
            axios.post.mockRejectedValueOnce(new Error('Request failed'));
            
            const token = await getSpotifyAccessToken();
            expect(token).toBeNull();
        });
    });
});

afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
});
