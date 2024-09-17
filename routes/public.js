const express = require('express');
const route = express.Router();
const path = require('path');

const mainPath = path.join('/../public')

route.get('/editing',(req,res) => {
    res.sendFile(`${mainPath}/../video.html`, {root: `${__dirname}/../public` })
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



module.exports = route;