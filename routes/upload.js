const express = require('express');
const route = express.Router();
const path = require('path');
const { upload } = require('../uploading/multer');

// upload
route.post('/video',upload.single('video'),(req,res) => {
    res.redirect(`/editing?video=${req.file.filename}`)
})


module.exports = route;