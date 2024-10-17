const express = require('express');
const { authMiddleware } = require('../middleware/auth');

const { 
    createSession,
    sessions,
    deleteSession,
    updateSession,
    addVideoToSession,
    deleteFromSession,
    getVideosOfSession
} = require('../service/sessionService');


const Route = express.Router();

Route.post('/session/create', createSession);

Route.get('/sessions', sessions);

Route.delete('/session/:id',authMiddleware, deleteSession);

Route.put('/session/:id',authMiddleware, updateSession);

Route.post('/session/add/video', addVideoToSession);

Route.delete('/session/add/video', deleteFromSession);

Route.get('/session/videos/:sessionId', getVideosOfSession);

Route.get('/session/join/:sessionId',(req,res,next) => {
    res.redirect('/editing')
})

module.exports = Route