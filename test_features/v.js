const { exec } = require('child_process');
const fs = require('fs');

// URL of the YouTube playlist
const playlistUrl = 'https://www.youtube.com/playlist?list=PL5Lsd0YA4OMHXXfwBrBGr6GlVooGNOHLe';

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
        exec(`yt-dlp -J "https://www.youtube.com/watch?v=${videoId}"`, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error fetching formats for ${videoId}: ${stderr}`);
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

        fs.writeFileSync('formats.json', JSON.stringify(allFormats, null, 2));
        console.log('Formats saved to formats.json');
    } catch (error) {
        console.error(error);
    }
};

// Execute the main function
main();
