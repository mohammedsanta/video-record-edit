const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../utils/createToken');
const User = require('../model/User');
const Video = require('../model/video');


exports.saveDataVideo = asyncHandler(async (req,res,next) => {

    // after upload video save path of data of video to database
    
    const { title } = req.body;

    if(!req.body.videoCheck) {
        return res.status(400).json({ message: 'Video not Selected Yet' });
    }
    
    const data = verifyToken(req.cookies.token)

    validTitle = await Video.find({ title });
    
    if(validTitle.length) {
        return res.json({ message: 'This Title Already exists' });
    }
    
    const saveVideo = await Video.create({
        username: data.id,
        title,
        path: `${title}-${data.id}.mp4`,
    });
    
    res.redirect('/')

});