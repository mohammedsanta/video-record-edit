const { exec } = require('child_process');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { stdout, stderr } = require('process');
const { verifyToken } = require('../utils/createToken');
const Video = require('../model/video');

// get title

const getData = async (url) => {

    const videoUrl = 'https://www.youtube.com/watch?v=jIRLTIpIe0o'; // Replace with dynamic input if needed

    const data = [];

    // Function to execute a command and return a Promise
    const getTitle = () => {
        return new Promise((resolve, reject) => {
            exec(`yt-dlp --get-title ${url}`, { encoding: 'utf8' }, (err, stdout, stderr) => {
                if (err) {
                    reject(stderr);
                    return;
                }
                resolve(stdout.trim());
            });
        });
    };

    // Function to execute a command and return a Promise
    const getthubnail = () => {
        return new Promise((resolve, reject) => {
            exec(`yt-dlp --get-thumbnail ${url}`, { encoding: 'utf8' }, (err, stdout, stderr) => {
                if (err) {
                    reject(stderr);
                    return;
                }
                resolve(stdout.trim());
            });
        });
    };

    data.push(await getTitle());
    data.push(await getthubnail());
    // data.push()
    // data.push()

    return data

}

// Endpoint to get formats
exports.getFormat = asyncHandler(async (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const data = await getData(req.body.url);

    exec(`yt-dlp -F ${url}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }

        const lines = stdout.split('\n').filter(line => line.trim() !== '');
        console.log(lines)
        const formats = lines.map(line => {
            const parts = line.trim().split(/\s+/);
            return {
                format_code: parts[0],
                extension: parts[1],
                resolution: parts[2] || 'N/A',
                size: parts[4] || 'N/A',
                bitrate: parts[3] || 'N/A'
            };
        }).slice(1); // Skip header line

        // Separate audio formats
        const audioFormats = formats.filter(format => {
            return format.extension === 'mp3' || 
                   format.extension === 'aac' || 
                   format.extension === 'm4a' || 
                   format.extension === 'wav';
        });

        // Filter video formats for resolutions between 480p and 4K (2160p)
        const videoFormats = formats.filter(format => {
            const resolution = format.resolution;
            if (resolution === 'N/A') return false;

            // Extract the numeric value from the resolution string
            const resValue = parseInt(resolution);
            return resValue >= 480 && resValue <= 2160; // 2160p is 4K
        });

        // Prepare the response with both audio and video formats
        res.json({ audioFormats, videoFormats,data });
    });
});

exports.downloadVideo = asyncHandler(async (req,res,next) => {
    
    const { videoFormat, audioFormat, url } = req.body;

    // title of video is depends on user and the title which he typed
    const title = `title-` + Date.now();

    // Construct the output path with the specified filename
    const outputFilePath = path.join(__dirname, '../outputs/' , `${title}.mp4`);

    const ytDlp = spawn('yt-dlp', [
        '-f', `${videoFormat}+${audioFormat}`, // Combine video and audio formats
        url,
        '--output', outputFilePath, // Specify output filename format with path
    ]);

    ytDlp.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ytDlp.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ytDlp.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
            // Send the processed file to the user
            // if(fs.existsSync(outputFilePath)) {
                return res.download(outputFilePath,(err) => {
                    if (err) {
                        console.error(`Error sending file: ${err.message}`);
                        res.status(500).send(`Error sending file: ${err.message}`);
                    } else {
                        // Optionally delete files after sending them
                        fs.unlinkSync(outputFilePath); // Remove the processed file
                    }
                });
            // }
        } else {
            res.status(500).json({ error: 'Download failed' });
        }
    });

})

exports.downloadPlaylist = asyncHandler(async (req,res,next) => {

    const { url } = req.body;
    const outputPath = path.join( __dirname, `/../youtubeJson/test.json`)

    await playlistProcess(url,outputPath);

    fs.readFile(outputPath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send(`Error ${err}`);
        }
        res.json(JSON.parse(data));
    });

    // res.send('?')

})

exports.saveVideo = asyncHandler(async (req,res,next) => {
    
    const { videoFormat, audioFormat, url } = req.body;

    // title of video is depends on user and the title which he typed
    const title = `title-` + Date.now();

    // Construct the output path with the specified filename
    const outputFilePath = path.join(__dirname, '../outputs/' , `${title}.mp4`);
    const uploadsPath = path.join( __dirname, `/../uploads/` );
    const data = verifyToken(req.cookies.token)
    console.log(data)
    const userPath = `${uploadsPath}/${data.username}/${title}.mp4`;

    if(!fs.existsSync(uploadsPath)) {
        fs.mkdir(dirPath, { recursive: true }, (err) => {
            if (err) {
              console.error('Error creating directory:', err);
            } else {
              console.log('Directory created successfully!');
            }
          });
    }

    const ytDlp = spawn('yt-dlp', [
        '-f', `${videoFormat}+${audioFormat}`, // Combine video and audio formats
        url,
        '--output', outputFilePath, // Specify output filename format with path
    ]);

    ytDlp.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ytDlp.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ytDlp.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
            // Send the processed file to the user
            // if(fs.existsSync(outputFilePath)) {
            // Source and destination paths

            // Move the file
            fs.rename(outputFilePath, userPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
            } else {
                console.log('File moved successfully!');
            }
            });
            
        } else {
            res.status(500).json({ error: 'Download failed' });
        }
    });

    const saveVideo = await Video.create({
        username: data.id,
        title,
        path: `${title}.mp4`,
    });

})

const playlistProcess = async (playlistUrl,outputPath) => {

    // Function to get video IDs from the playlist
    const getVideoIds = () => {
        return new Promise((resolve, reject) => {
            exec(`yt-dlp --get-id "${playlistUrl}"`, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Error fetching video IDs: ${stderr}`);
                }
                const videoIds = stdout.split('\n').filter(id => id);
                resolve(videoIds);
            });
        });
    };

    // Function to get formats for each video
    const getFormats = (videoId) => {
        return new Promise((resolve, reject) => {
            exec(`yt-dlp -J ${videoId}`, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Error fetching formats for videoid: ${stderr}`);
                }
                const videoInfo = JSON.parse(stdout);
                resolve(videoInfo.formats);
            });
        });
    };

    // Main function to orchestrate the process
    const main = async () => {
        try {
            const videoIds = await getVideoIds();
            const allFormats = [];

            for (const videoId of videoIds) {
                const formats = await getFormats(videoId);
                allFormats.push({ videoId, formats });
            }

            fs.writeFileSync(outputPath, JSON.stringify(allFormats, null, 2));
            console.log('Formats saved to formats.json');
        } catch (error) {
            console.error(`file not created ${error}`);
        }
    };

    await main()

}