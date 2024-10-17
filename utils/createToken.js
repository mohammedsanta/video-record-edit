const jwt = require('jsonwebtoken');

const secretKey = 'yourSecretKey'; // Replace with your own secret key

// Function to create a token
const createToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, secretKey, {
        expiresIn: '1h', // Token expiration time
    });
};

// Function to verify a token
const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};

module.exports = { createToken, verifyToken };