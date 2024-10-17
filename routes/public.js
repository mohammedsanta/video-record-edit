const express = require('express');
const route = express.Router();
const path = require('path');
const { getFormat, downloadVideo, downloadPlaylist } = require('../service/downloadVideoService');

const mainPath = path.join('/../public')

route.get('/',(req,res) => {
    const file = path.join(__dirname , '/../public/shorts.html')
    res.sendFile(file)
});

route.get('/auth/login',(req,res) => {
    res.sendFile(`${mainPath}/../login.html`, {root: `${__dirname}/../public` })
})

route.get('/editing/:session',(req,res) => {
    res.sendFile(`${mainPath}/../video.html`, {root: `${__dirname}/../public` })
})

route.get('/resize',(req,res) => {
    res.sendFile(`${mainPath}/../resize.html`, {root: `${__dirname}/../public` })
})

route.get('/convert',(req,res) => {
    res.sendFile(`${mainPath}/../convert.html`, {root: `${__dirname}/../public` })
})

route.get('/record',(req,res) => {
    res.sendFile(`${mainPath}/../recordAndUpload.html`, {root: `${__dirname}/../public` })
})

route.get('/upload',(req,res,next) => {
    res.sendFile(`${mainPath}/../upload.html`, {root: `${__dirname}/../public` })
});

route.get('/get/video',(req,res,next) => {
    res.sendFile(`${mainPath}/../downloadY.html`, {root: `${__dirname}/../public` })
});

route.get('/get/playlist',(req,res,next) => {
    res.sendFile(`${mainPath}/../downloadPlaylist.html`, {root: `${__dirname}/../public` })
});

route.get('/profile',(req,res,next) => {
    res.sendFile(`${mainPath}/../profile.html`, {root: `${__dirname}/../public` })
});

route.get('/mutiledit',(req,res,next) => {
    res.sendFile(`${mainPath}/../multiedit.html`, {root: `${__dirname}/../public` })
});


route.post('/formats',getFormat )
route.post('/playlist',downloadPlaylist )
route.post('/download',downloadVideo )

module.exports = route;