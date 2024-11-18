const express = require('express');
const route = express.Router();
const { getFormat, downloadVideo, downloadPlaylist, saveVideo } = require('../service/downloadVideoService');
const path = require('path');
const mainPath = path.join('/../public')

// youtube

route.get('/video',(req,res,next) => {
    res.sendFile(`${mainPath}/../youtubeVideo.html`, {root: `${__dirname}/../public` })
});

route.get('/playlist',(req,res,next) => {
    res.sendFile(`${mainPath}/../youtubePlaylist.html`, {root: `${__dirname}/../public` })
});


route.post('/formats',getFormat )
route.post('/playlist',downloadPlaylist )
route.post('/video',downloadVideo )
route.post('/video/save',saveVideo )

module.exports = route;