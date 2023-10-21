const axios = require('axios');
const qs = require('querystring');
const btoa = require('btoa');

async function getSpotifyAccessToken() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const authString = btoa(`${clientId}:${clientSecret}`);

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
            grant_type: 'client_credentials'
        }), {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error obtaining Spotify access token:', error);
        return null;
    }
}

module.exports = {
    getSpotifyAccessToken
};
