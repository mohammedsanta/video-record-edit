const express = require('express');
const { thumbnail, gif } = require('../service/getFromVideoService');
const route = express.Router()

// screenshot
route.get('/screenshot',thumbnail);

// gif
route.get('/gif',gif);

module.exports = route;