const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../utils/createToken');
const User = require('../model/User');
const Video = require('../model/video');


exports.saveDataVideo = asyncHandler(async (req,res,next) => {

    // after upload video save path of data of video to database
    
    const { title } = req.body;
    
    const data = verifyToken(req.cookies.token)

    validTitle = await Video.find({ title });

    console.log(req.body)

    
    if(validTitle.length) {
        return res.json({ message: 'This Title Already exists' });
    }
    
    const saveVideo = await Video.create({
        username: data.id,
        title,
        path: `${title}-${data.id}.mp4`,
    });
    
    res.redirect('http://127.0.0.1:3000/profile')

})