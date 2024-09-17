const ffmpeg = require('fluent-ffmpeg');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const child = require('child_process');

/**
 * Endpoint to extract and serve a video thumbnail.
 */
exports.thumbnail = asyncHandler(async (req, res, next) => {
    const inputPath = path.join(__dirname, '/../uploads', req.query.video);
    const outputPath = path.join(__dirname, '/../screenshot', 'thumbnail.png');

    console.log('Input Path:', inputPath);
    console.log('Output Path:', outputPath);

    try {
        // Extract thumbnail
        await extractThumbnail(inputPath, outputPath,req.query.time);

        // Check if the thumbnail file exists and serve it
        if (fs.existsSync(outputPath)) {
            res.download(outputPath, (err) => {
                if (err) {
                    console.error(`Error sending file: ${err.message}`);
                    res.status(500).send(`Error sending file: ${err.message}`);
                } else {
                    fs.unlinkSync(outputPath)
                }
            });
        } else {
            res.status(404).send('Processed file not found.');
        }
    } catch (err) {
        next(err); // Pass error to Express error handler
    }
});

/**
 * Extract a thumbnail from a video.
 * 
 * @param {string} inputFilePath - Path to the input video file.
 * @param {string} outputFilePath - Path where the thumbnail will be saved.
 * @param {number} timestamp - Timestamp (in seconds) to capture the thumbnail from.
 * @returns {Promise<void>} - A promise that resolves when the thumbnail has been saved.
 */
const extractThumbnail = (inputFilePath, outputFilePath, timestamp) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .screenshots({
                timestamps: [timestamp], // Capture thumbnail at the specified timestamp
                filename: path.basename(outputFilePath),
                folder: path.dirname(outputFilePath),
                // size: '320x?', // Set thumbnail size, maintaining aspect ratio
            })
            .on('end', () => {
                console.log('Thumbnail extracted successfully!');
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error extracting thumbnail: ${err.message}`);
                reject(err);
            });
    });
};

/**
 * Convert a video segment to a GIF using FFmpeg with original dimensions.
 * 
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFilePath - The path to save the generated GIF.
 * @param {number} startTime - The start time in seconds for the GIF segment.
 * @param {number} duration - The duration in seconds of the GIF segment.
 * @returns {Promise<void>} - A promise that resolves when the GIF is generated.
 */
const convertToGif = (inputFilePath, outputFilePath, startTime = 2, duration = 5,fps = 50) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .setStartTime(startTime)
            .setDuration(duration)
            .videoFilters(`fps=${fps}`) // Only set the frame rate; no scaling
            .output(outputFilePath)
            .on('start', commandLine => {
                console.log(`FFmpeg command: ${commandLine}`);
            })
            .on('end', (commend) => {
                console.log('GIF created successfully!',commend);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error creating GIF: ${err.message}`);
                reject(err);
            })
            .run();
    });
};

const cutVideo = (inputFilePath, outputFilePath, startTime, duration) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .setStartTime(startTime)
            .setDuration(duration)
            .output(outputFilePath)
            .on('end', () => {
                console.log('Video cut successfully!');
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error cutting video: ${err.message}`);
                reject(err);
            })
            .run();
    });
};

exports.gif = asyncHandler(async (req,res,next) => {

    // Path to the input video file
    const inputFilePath = path.join(__dirname, '/../uploads' , req.query.video);
    // Set file name to time
    const filename = Date.now();
    // Path to the output GIF file
    const outputFilePath = path.join(__dirname, `/../screenshot/${filename}.gif`)

    await convertToGif(inputFilePath, outputFilePath,req.query.start,req.query.duration,req.query.fps)
    .then(() => console.log('GIF creation complete.'))
    .catch(err => console.error('Failed to create GIF:', err));

    if (fs.existsSync(inputFilePath)) {
        res.download(outputFilePath, (err) => {
            if (err) {
                console.error(`Error sending file: ${err.message}`);
                res.status(500).send(`Error sending file: ${err.message}`);
                console.log(fs.existsSync(inputFilePath))
            } else {
                // Optionally delete files after sending them
                fs.unlinkSync(outputFilePath);  // Remove the uploaded file
            }
        });
    } else {
        return res.status(404).send('Processed file not found.');
    }


});

