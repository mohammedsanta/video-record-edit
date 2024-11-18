const express = require('express');
const route = express.Router();
const path = require('path');
const { upload } = require('../uploading/multer');
const { formating, formatingFromLibrary } = require('../service/formatingService');
const { saveDataVideo } = require('../service/uploadVideoService');

route.post('/',upload.single('video'),formating);
route.post('/library',formatingFromLibrary,saveDataVideo);

// route.get('/',(req,res) => {
//     const file = path.join(__dirname , '/../public/shorts.html')
//     res.sendFile(file)
// });


module.exports = route;