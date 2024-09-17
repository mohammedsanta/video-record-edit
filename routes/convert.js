const express = require('express');
const { upload } = require('../uploading/multer');
const { coverting } = require('../service/videoCovertService');
const route = express.Router()

route.post('/to',upload.single('file'),coverting)


module.exports = route;