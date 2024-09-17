const ffmpeg = require('fluent-ffmpeg');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const child = require('child_process');


const mainCode = async (file, output,size,codec) => {
    return new Promise((resolve, reject) => {
        ffmpeg(file)
            .output(output)
            .size(size) // Resize to desired resolution
            .audioCodec('libmp3lame') // Ensure audio codec is set
            .audioBitrate('192k') // Set audio bitrate
            // .videoCodec(codec) // Ensure video codec is set
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
            .run();
    });
};

const audioMainCode = (inputFile, outputFile, format = '', quality = '') => {
    
    // Define bitrate for each quality level
    const bitrates = {
        low: '64k',
        medium: '128k',
        high: '192k',
        veryhigh: '256k'
    };

    // Map format to codec
    const codecMap = {
        mp3: 'libmp3lame',
        aac: 'aac',
        wav: 'pcm_s16le',
        flac: 'flac',
        ogg: 'libvorbis',
        opus: 'libopus',
        alac: 'alac',
        speex: 'libspeex'
    };
    
    return new Promise((resolve, reject) => {
        // Construct the FFmpeg command
        const command = `ffmpeg -i "${inputFile}" -c:a ${codecMap[format]} -b:a ${bitrates[quality]} "${outputFile}"`;

        // Execute the FFmpeg command
        child.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`FFmpeg stderr: ${stderr}`);
            }
            console.log(`FFmpeg stdout: ${stdout}`);
            resolve();
        });
    });
};

exports.coverting = asyncHandler(async (req,res,next) => {
console.log('ttttttttttttttt',req.body)
    let time = Date.now();
    let file = path.join(__dirname, '/../',req.file.path)
    let output = path.join(__dirname, '/../convert/',`${time}.${req.body.format}`)

    const { for: VorA, format,resolution,quality } = req.body;

    switch(VorA) {

        case 'video':

        // output += req.body.videoFormat;

        await mainCode(file,output,resolution,req.body.codec);
        fs.unlinkSync(file);

        res.download(output, err => {
            if (err) {
                console.error('Error sending file:', err);
            }
            // Clean up files
            // fs.unlinkSync(file);
            fs.unlinkSync(output);
        });


        break;
        case 'audio':

            await audioMainCode(file,output,format,quality,req.body.codec);
        
            res.download(output, err => {
                if (err) {
                    console.error('Error sending file:', err);
                }
                // Clean up files
                fs.unlinkSync(file);
                // fs.unlinkSync(output);
            });

        break;
            
            default:
                res.status(400)
    }


})