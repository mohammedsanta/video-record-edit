const express = require('express');
const { triming } = require('../service/trimVideoService');
const { resize, trimingService } = require('../service/editService');
const route = express.Router()

// trim
route.post('/trim',trimingService);

route.post('/resize',resize);

module.exports = route;