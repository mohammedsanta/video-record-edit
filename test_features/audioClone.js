
const audioMainCodeClone = async (file, output,format, quality) => {
    return new Promise((resolve, reject) => {
        // Validate input parameters
        // if (!file || typeof file !== 'string') {
        //     return reject(new Error('Invalid file path or stream.'));
        // }
        // if (!output || typeof output !== 'string') {
        //     return reject(new Error('Invalid output path or filename.'));
        // }
        // if (!format || !['mp3', 'wav', 'aac', 'ogg', 'flac'].includes(format)) {
        //     return reject(new Error('Unsupported audio format. Supported formats are: mp3, wav, aac, ogg, flac.'));
        // }
        // if (!quality || !['low', 'medium', 'high', 'very-high'].includes(quality)) {
        //     return reject(new Error('Invalid audio quality. Options are: low, medium, high, very-high.'));
        // }

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
            aac: 'libfdk_aac',
            wav: 'pcm_s16le',
            flac: 'flac',
            ogg: 'libvorbis',
            opus: 'libopus',
            alac: 'alac',
            speex: 'libspeex'
        };

            
            // Process audio with ffmpeg
            ffmpeg(file)
                .output(output)
                .audioCodec('adts') // Default codec for MP3, adjust for other formats
                .audioBitrate(bitrates[quality])
                .toFormat(format)
                .on('start', commandLine => console.log(`FFmpeg command: ${commandLine}`))
                .on('stderr', stderrLine => console.error(`FFmpeg stderr: ${stderrLine}`))
                .on('end', () => {
                    console.log('Audio processing completed successfully!');
                    resolve();
                })
                .on('error', err => {
                    console.error(`Error processing audio: ${err.message}`);
                    reject(err);
                })
                .run();

    });
};
