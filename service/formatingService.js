const ffmpeg = require('fluent-ffmpeg');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');


const mainCode = async (inputFilePath, outputFilePath, filter) => {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .videoFilters(filter)
            .on('start', commandLine => console.log(`FFmpeg command: ${commandLine}`))
            .on('stderr', stderrLine => console.error(`FFmpeg stderr: ${stderrLine}`))
            .on('end', () => {
                console.log('Video processing completed successfully!');
                resolve();
            })
            .on('error', err => {
                console.error(`Error processing video: ${err.message}`);
                reject(err);
            })
            .save(outputFilePath);
    });
};

// Crop video to fit YouTube Shorts format
const croping = async (inputFilePath, outputFilePath) => {
    const filter = 'crop=405:720';
    await mainCode(inputFilePath, outputFilePath, filter);
};

// Rotate video to fit YouTube Shorts format
const rotating = async (inputFilePath, outputFilePath) => {
    const getVideoDimensions = (inputFilePath) => {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
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

    const cropVideo = async (inputFilePath, outputFilePath) => {
        const { width, height } = await getVideoDimensions(inputFilePath);
        const paddingWidth = Math.max(1280, width);
        const paddingHeight = Math.max(1280, height);
        const padFilter = `pad=${paddingWidth}:${paddingHeight}:(ow-iw)/2:(oh-ih)/2:black`;
        const filter = `${padFilter},rotate=PI/2,crop=720:1280:1280-720:0`;
        await mainCode(inputFilePath, outputFilePath, filter);
    };

    await cropVideo(inputFilePath, outputFilePath);
};

// Padding video to fit YouTube Shorts format
const padding = async (inputFilePath, outputFilePath) => {
    const filter = 'pad=1280:2275:(ow-iw)/2:(oh-ih)/2';
    await mainCode(inputFilePath, outputFilePath, filter);
};

// Scale video to fit YouTube Shorts format
const scaling = async (inputFilePath, outputFilePath, height = 1920) => {
    const width = 1080;
    const filter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`;
    await mainCode(inputFilePath, outputFilePath, filter);
};

// Main route handler
exports.formating = asyncHandler(async (req, res) => {
    
    const type = req.body.editOption;
    const { path: tempPath, originalname } = req.file;
    const videoPath = path.join(__dirname, '/../', tempPath);
    const outputPath = path.join(__dirname, '/../', './outputs/', originalname);

    try {
        switch (type) {
            case 'croping':
                await croping(videoPath, outputPath);
                break;
            case 'rotating':
                await rotating(videoPath, outputPath);
                break;
            case 'scaling':
                await scaling(videoPath, outputPath);
                break;
            case 'padding':
                await padding(videoPath, outputPath);
                break;
            default:
                return res.status(400).send('Invalid edit option.');
        }

        // Check if the output file exists and send it to the user
        if (fs.existsSync(outputPath)) {
            return res.download(outputPath, (err) => {
                if (err) {
                    console.error(`Error sending file: ${err.message}`);
                    return res.status(500).send(`Error sending file: ${err.message}`);
                } else {
                    // Optionally delete files after sending them
                    fs.unlinkSync(videoPath);  // Remove the uploaded file
                    fs.unlinkSync(outputPath); // Remove the processed file
                }
            });
        } else {
            return res.status(404).send('Processed file not found.');
        }
    } catch (error) {
        return res.status(500).send(`Error processing video: ${error.message}`);
    }
});
