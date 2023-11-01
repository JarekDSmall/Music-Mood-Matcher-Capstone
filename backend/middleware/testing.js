// testing.js

const bypassSpotifyAuthForTesting = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        // Mock user data or any other data you would get from Spotify here if necessary
        req.user = {
            id: 'mockUserId',
            // Add any other mock user data as needed
        };
        return next();
    } else {
        // If not in test environment, proceed with actual authentication
        // If you have an actual Spotify authentication middleware, you can call it here.
        // For now, I'll just call next() to proceed to the next middleware or route handler.
        return next();
    }
};

module.exports = bypassSpotifyAuthForTesting;
