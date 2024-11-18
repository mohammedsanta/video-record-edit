const express = require('express');
const route = express.Router();
const path = require('path');
const { upload } = require('../uploading/multer');
const { saveDataVideo } = require('../service/uploadVideoService');
const { authMiddleware } = require('../middleware/auth');

// upload
// route.post('/video',upload.single('video'),(req,res) => {
//     res.redirect(`/editing?video=${req.file.filename}`)
// })




route.post('/video',authMiddleware,upload.single('video'),saveDataVideo)


module.exports = route;