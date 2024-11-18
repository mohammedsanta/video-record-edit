const asyncHandler = require('express-async-handler');
const Video = require('../model/video');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../utils/createToken');


exports.getVideos = asyncHandler(async (req,res,next) => {

    const data = verifyToken(req.cookies.token);
    const videos = await Video.find({ username: data.id });

    res.json({ videos });

});

exports.getVideo = asyncHandler(async (req,res,next) => {

    const video = await Video.findById(req.params.id);

    res.json({ video });

});

exports.displayVideo = asyncHandler(async (req, res) => {

    const videoId = req.params.id;
    const user = verifyToken(req.cookies.token);
    const video = await Video.findById(videoId);

    // Assume video files are stored in a directory called 'videos'
    const videoPath = path.join(__dirname,'/../uploads',`${user.username}/${video.path}`); // Change the extension if necessary

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;



    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize) {
            res.status(416).send('Requested Range Not Satisfiable');
            return;
        }

        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        res.writeHead(206, {
            'Content-Type': 'video/mp4',
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Content-Length': chunksize,
        });
        file.pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        });
        fs.createReadStream(videoPath).pipe(res);
    }

    // Check if the file exists
    // if not delete video from database
    // fs.stat(videoPath, async (err, stats) => {
    //     if (err || !stats.isFile()) {
    //         await Video.findByIdAndDelete(videoId);
    //         return res.status(404).send('Video not found');
    //     }

    //     // Set headers for video streaming
    //     res.writeHead(200, {
    //         'Content-Type': 'video/mp4',
    //         'Content-Length': stats.size,
    //     });

    //     // Create a read stream and pipe it to the response
    //     const readStream = fs.createReadStream(videoPath);
    //     readStream.pipe(res);
    // });
});

exports.deleteVideo = asyncHandler(async (req,res,next) => {

    const video = await Video.findOneAndDelete({ _id: req.params.id });
    const data = verifyToken(req.cookies.token);
    
    // Check if video was found and deleted
    if (!video) {
        return res.status(404).json({ message: 'Video hasn\'t been deleted' });
    }
    
    // Construct the path to the video file
    const pathVideo = path.join(__dirname, `/../uploads/${data.username}/${video.path}`);
    
    // Delete the video file
    fs.unlink(pathVideo, (err) => {
        if (err) {
            console.error('Error deleting video file:', err);
            return res.status(500).json({ message: 'Failed to delete video file' });
        }
    
        // Send a success response
        res.json({ message: 'Video has been deleted' });
    });

});

exports.updateVideo = asyncHandler(async (req,res,next) => {

    const data = verifyToken(req.cookies.token);
    const video = await Video.findOne({_id: req.params.id});
    const videoCheck = await Video.findOne({ title: req.body.title });


    const pathVideo = path.join(__dirname, `/../uploads/${data.username}/${video.path}`);
    const newPathVideo = path.join(__dirname, `/../uploads/${data.username}/${req.body.title}-${data.id}.mp4`);

    if(videoCheck) {
        return res.status(401).json({ message: 'title already exists' });
    }

    video.title = `${req.body.title}`;
    video.path = `${req.body.title}-${data.id}.mp4`;
    video.save();
    
    fs.rename(pathVideo, newPathVideo, (err) => {
        if (err) {
            console.error('Error renaming video file:', err);
            return res.status(500).json({ message: 'Failed to rename video file' });
        }
        // Send a success response
        res.json({ message: 'Video has been renamed' });
    });
    

})