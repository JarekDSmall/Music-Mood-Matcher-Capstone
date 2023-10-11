const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (authHeader) {
        // Extract the token from the Authorization header
        const token = authHeader.split(' ')[1];

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            // Attach the user payload to the request object
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Access token required' });
    }
}

module.exports = authenticateJWT;
