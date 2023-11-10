require('dotenv').config();
const request = require('supertest');
const { app, connectToDatabase } = require('../index.js'); // Adjust the path as necessary
const bypassSpotifyAuthForTesting = require('../middleware/testing'); // Add this line

const server = app.listen();
const agent = request.agent(server);

beforeAll(async () => {
    app.use(bypassSpotifyAuthForTesting); // Use the middleware
    await connectToDatabase();
});

describe('Genres Route', () => {
    it('GET /genres - get all genres', async () => {
        const response = await agent.get('/genres');
        expect(response.statusCode).toBe(200);
        // Replace the expected array with the actual genres your API should return
        expect(response.body).toEqual(['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Country', 'Electronic']);
    });
});

afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
});
