const express = require('express');
const route = express.Router();
const path = require('path');
const { authMiddleware } = require('../middleware/auth');

const mainPath = path.join('/../public')

route.get('/',authMiddleware,(req,res) => {
    const file = path.join(__dirname , '/../public/home.html')
    res.sendFile(file)
});

route.get('/shorts',(req,res) => {
    const file = path.join(__dirname , '/../public/shorts.html')
    res.sendFile(file)
});

route.get('/auth/login',(req,res) => {
    res.sendFile(`${mainPath}/../login.html`, {root: `${__dirname}/../public` })
})

route.get('/editing/:session',authMiddleware,(req,res) => {
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

// route.get('/profile',(req,res,next) => {
//     res.sendFile(`${mainPath}/../profile.html`, {root: `${__dirname}/../public` })
// });


module.exports = route;