const { verifyToken } = require("../utils/createToken");

exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        // return res.status(403).json({ error: 'No token provided.' });
        return res.redirect('/auth/login')
    }

    try {
        const decoded = verifyToken(token);
        req.userId = decoded.id; // Store user ID in request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized!' });
    }
};