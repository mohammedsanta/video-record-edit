const asyncHandler = require('express-async-handler');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { codetrim, triming } = require('./trimVideoService');

// Triming Video
exports.trimingService = asyncHandler(async (req,res,next) => {

  console.log(req.body)
  console.log(req.body.resize)

    const videoPath = path.join(__dirname,'/../uploads',req.query.video);
    const outputPath = path.join(__dirname, `\\..\\outputs\\name.mp4`)

    const { start, end, resize: crop } = req.body;

    // if not array because it works with array only
    var StartEnd = [ start, end ];

    if (!Array.isArray(StartEnd[0]) && !Array.isArray(StartEnd[1])) {
        var StartEnd = [ [StartEnd[0]] , [StartEnd[1]] ]
    }

    try {
        const code = codetrim(videoPath,outputPath,StartEnd,crop,req.body.volume)
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

// resize video
exports.resize = asyncHandler(async (req,res,next) => {

    const inputPath = "D:/Coding/JS/nodejs/videoedit/uploads/uploadedoutput.mp4";
    const outputPath = "D:/Coding/JS/nodejs/videoedit/uploads/output.mp4";

    const { width, height, x, y } = req.body; // Add x and y for cropping

    console.log(req.body)

  // Construct the FFmpeg command
  const ffmpegCommand = `ffmpeg -i "${inputPath}" -vf "crop=${width}:${height}:${x}:${y}" "${outputPath}"`;

  // Execute the command
  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Error cropping video:', error);
      console.error('FFmpeg stderr:', stderr);
      return res.status(500).send('Error cropping video');
    }

    // Send the cropped video as a response
    res.download(outputPath, (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
      }
    //   fs.unlinkSync(inputPath);
    //   fs.unlinkSync(outputPath);
    });
  });


//   res.send('?')
})