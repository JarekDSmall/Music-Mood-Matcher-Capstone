const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } else {
        const spotifyToken = req.cookies.spotifyAuthToken;
        if (!spotifyToken) {
            return res.status(401).json({ message: 'Access token required' });
        }
        next();
    }
    
}

module.exports = authenticateJWT;
