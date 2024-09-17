const express = require('express');
const { loadVideo } = require('../service/loadVideoService');
const route = express.Router()

route.get('/video',loadVideo)


module.exports = route;