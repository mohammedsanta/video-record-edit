const express = require('express');
const { signup, login } = require('../service/auth');
const Route = express.Router();

Route.post('/signup',signup)
Route.post('/login',login)

module.exports = Route