const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getVideos, getVideo, displayVideo, updateVideo } = require('../service/videoService');
const Route = express.Router();

Route.get('/videos',authMiddleware,getVideos);

Route.get('/videos/:id',authMiddleware,getVideo);

// Endpoint to serve video by ID
Route.get('/video/:id',displayVideo);

Route.delete('/video/:id',authMiddleware,);

Route.put('/video/:id',authMiddleware,updateVideo);

module.exports = Route