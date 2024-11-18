const express = require('express');
const { signup, login, logout } = require('../service/auth');
const Route = express.Router();

Route.post('/signup',signup)
Route.post('/login',login)
Route.post('/logout',logout)

module.exports = Route