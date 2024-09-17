const ffmpeg = require('fluent-ffmpeg');
const asyncHandler = require('express-async-handler')
const fs = require('fs');
const path = require('path');

/**
 * croping a video to fit the YouTube Shorts format using FFmpeg.
 * 
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFilePath - The path to save the scaled video file.
 * @returns {Promise<void>} - A Promise that resolves when processing is complete.
 */

const croping = async (inputFilePath, outputFilePath) => {

    const commend = 'crop=405:720';

    await mainCode(inputFilePath,outputFilePath,commend);

};

/**
 * rotating a video to fit the YouTube Shorts format using FFmpeg.
 * 
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFilePath - The path to save the scaled video file.
 * @returns {Promise<void>} - A Promise that resolves when processing is complete.
 */

const rotating = async (inputFilePath, outputFilePath) => {

    const getVideoDimensions = (inputFilePath) => {
        return new Promise((resolve, reject) => {
            return ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
                if (err) return reject(err);
                const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
                if (videoStream) {
                    resolve({ width: videoStream.width, height: videoStream.height });
                } else {
                    reject(new Error('No video stream found.'));
                }
            });
        });
    };
    
    async function cropVideo (inputFilePath, outputFilePath) {
        return await getVideoDimensions(inputFilePath)
            .then(({ width, height }) => {
                const paddingWidth = Math.max(1280, width);
                const paddingHeight = Math.max(1280, height);
                const padFilter = `pad=${paddingWidth}:${paddingHeight}:(ow-iw)/2:(oh-ih)/2:black`;
    
                return new Promise((resolve, reject) => {
                    return ffmpeg(inputFilePath)
                        .videoFilters(`${padFilter},rotate=PI/2,crop=720:1280:1280-720:0`)
                        .on('start', commandLine => {
                            console.log(`FFmpeg command: ${commandLine}`);
                        })
                        .on('stderr', stderrLine => {
                            console.error(`FFmpeg stderr: ${stderrLine}`);
                        })
                        .on('end', () => {
                            console.log('Video cropped successfully!');
                            resolve();
                        })
                        .on('error', (err) => {
                            console.error(`Error processing video: ${err.message}`);
                            reject(err);
                        })
                        .save(outputFilePath);
                });
            });
    }

    return await cropVideo(inputFilePath, outputFilePath)

};

/**
 * padding a video to fit the YouTube Shorts format using FFmpeg.
 * 
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFilePath - The path to save the scaled video file.
 * @returns {Promise<void>} - A Promise that resolves when processing is complete.
 */

const padding = async (inputFilePath, outputFilePath) => {

    const commend = 'pad=1280:2275:(ow-iw)/2:(oh-ih)/2';

    await mainCode(inputFilePath,outputFilePath,commend);

};

/**
 * Scales a video to fit the YouTube Shorts format using FFmpeg.
 * 
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFilePath - The path to save the scaled video file.
 * @param {number} height - The height to scale the video to (e.g., 1920 for YouTube Shorts).
 * @returns {Promise<void>} - A Promise that resolves when processing is complete.
 */

const scaling = async (inputFilePath, outputFilePath, height = 1920) => {
    // Calculate the width maintaining the aspect ratio
    const width = 1080;
    const filter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;

    await mainCode(inputFilePath, outputFilePath, filter);
};

/**
 * Main function to execute FFmpeg command with specified filters.
 * 
 * @param {string} inputFilePath - The path to the input video file.
 * @param {string} outputFilePath - The path to save the processed video file.
 * @param {string} filter - The FFmpeg filter string to apply.
 * @returns {Promise<void>} - A Promise that resolves when processing is complete.
 */
const mainCode = async (inputFilePath, outputFilePath, filter) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .videoFilters(filter)
            .on('start', commandLine => {
                console.log(`FFmpeg command: ${commandLine}`);
            })
            .on('stderr', stderrLine => {
                console.error(`FFmpeg stderr: ${stderrLine}`);
            })
            .on('end', () => {
                console.log('Video type format for YouTube Shorts completed successfully!');
                resolve();
            })
            .on('error', err => {
                console.error(`Error processing video: ${err.message}`);
                reject(err);
            })
            .save(outputFilePath);
    });
};


exports.formating = asyncHandler(async (req, res) => {

    const type = req.body.editOption;

    const { path: tempPath, originalname } = req.file;
    const videoPath = path.join(__dirname, '/../', tempPath);
    const outputPath = path.join(__dirname, '/../', './outputs/', originalname);

    console.log(type);

    switch (type) {
        case 'croping':
            await croping(videoPath,outputPath);
            break;
        case 'rotating':
            await rotating(videoPath,outputPath);
            break;
        case 'scaling':
            await scaling(videoPath,outputPath);
            break;
        case 'padding':
            await padding(videoPath,outputPath);
            break;
        default:

            break;
    }

    // Check if the output file exists
    // Send the processed file to the user
    if (fs.existsSync(outputPath)) {
        return res.download(outputPath, (err) => {
            if (err) {
                console.error(`Error sending file: ${err.message}`);
                res.status(500).send(`Error sending file: ${err.message}`);
            } else {
                // Optionally delete files after sending them
                fs.unlinkSync(videoPath);  // Remove the uploaded file
                fs.unlinkSync(outputPath); // Remove the processed file
            }
        });
    } else {
        return res.status(404).send('Processed file not found.');
    }

});