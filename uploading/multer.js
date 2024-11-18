const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../utils/createToken');
const Video = require('../model/video');

const titleValidation = async (req) => {

    const video = await Video.findOne({ title: req.body.title });

    if(video) {
        return req.body.title = `${req.body.title}(1)`;
    }

    return req.body.title;

}

const createFolder = (username) => {

    const dirPath = path.join(__dirname, '/../uploads/' ,username); // Specify the folder path
    if(!fs.existsSync(dirPath)) {

        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating folder:', err);
            } else {
                console.log(`Folder created successfully at ${dirPath}`);
            }
        });
        console.log('folder created');
    }

}

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: async function (req,file,cb) {
        await titleValidation(req);

        const getToken = req.cookies.token;
        const user = verifyToken(getToken);
        req.body.videoCheck = true;

        if(!req.body.title) {
            req.body.title = Date.now();
        }

        createFolder(user.username)
        
        cb(null, `/${user.username}/${req.body.title}-${user.id}.mp4` )
    }
});

exports.upload = multer({ storage });