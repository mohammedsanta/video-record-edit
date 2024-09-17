const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const { triming, codetrim } = require('../effects/trim');

// Triming Video
exports.trimingService = asyncHandler(async (req,res,next) => {

    const videoPath = path.join(__dirname,'/../uploads',req.query.video);
    const outputPath = path.join(__dirname, `\\..\\outputs\\name.mp4`)

    const { start, end,addCrop } = req.body;

    // if not array because it works with array only
    var StartEnd = [ start, end ];

    if (!Array.isArray(StartEnd[0]) && !Array.isArray(StartEnd[1])) {
        var StartEnd = [ [StartEnd[0]] , [StartEnd[1]] ]
    }

    try {
        const code = codetrim(videoPath,outputPath,StartEnd,addCrop,req.body.volume)
        triming(code);

        // Send the processed file to the user
        if (fs.existsSync(outputPath)) {
            return res.download(outputPath, (err) => {
                if (err) {
                    console.error(`Error sending file: ${err.message}`);
                    res.status(500).send(`Error sending file: ${err.message}`);
                } else {
                    // Optionally delete files after sending them
                    // fs.unlinkSync(videoPath);  // Remove the uploaded file
                    fs.unlinkSync(outputPath); // Remove the processed file
                }
            });
        } else {
            return res.status(404).send('Processed file not found.');
        }
    } catch (error) {
        res.status(500).send(`Error processing video: ${error.message}`);
    }
next()
});

