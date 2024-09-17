const express = require('express');
const { triming } = require('../service/trimVideoService');
const route = express.Router()

// trim
route.post('/trim',triming)

module.exports = route;