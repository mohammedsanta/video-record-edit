const child  = require('child_process');


exports.codetrim = (inputFilePath = 'test.mp4',outputFilePath = 'output.mp4',cuts,crop = 0,volume) => {

    
    const dimensions = crop.split(',');
    
    let addVolume;
    console.log('cutssss',cuts)
    
    crop.length > 0 ? crop = `;[outv]crop=${dimensions[0]}:${dimensions[1]}:${dimensions[2]}:${dimensions[3]}[outv]` : '' ;

    console.log('cropcrop',crop)


    if(cuts[0].length == 1) {

        addVolume = `volume=${volume}`;

        return `ffmpeg -i "${inputFilePath}" -filter_complex "[0:v]trim=start=${cuts[0]}:duration=${cuts[1]},setpts=PTS-STARTPTS[v0];[0:a]atrim=start=${cuts[0]}:duration=${cuts[1]},asetpts=PTS-STARTPTS,${addVolume}[a0];[v0][a0]concat=n=1:v=1:a=1[outv][outa] ${crop}"  -map "[outv]" -map "[outa]" ${outputFilePath}`;

    }

    // Start Proccess of Case multi trim

    // return code by map

    // let filters = cuts.map((cut, index) => {

    //     console.log('indexxxx',index)

    //     addVolume = `volume=${volume[index]}`;

    //     const startTime = cuts[0][index];
    //     const duration = cuts[1][index];

    //     return `[0:v]trim=start=${startTime}:duration=${duration},setpts=PTS-STARTPTS[v${index}];[0:a]atrim=start=${startTime}:duration=${duration},asetpts=PTS-STARTPTS,${addVolume}[a${index}]`;
    // }).join(';');

    // return code by for

    let filters = '';
    for (let index = 0; index < cuts[0].length; index++) {
        console.log('indexxxx', index);

        // Construct volume filter for the current index
        const addVolume = `volume=${volume[index]}`;

        // Extract start time and duration for video and audio trimming
        const startTime = cuts[0][index];  // Assuming cuts is a 2D array
        const duration = cuts[1][index];

        // Append the FFmpeg filter string for the current index
        filters += `[0:v]trim=start=${startTime}:duration=${duration},setpts=PTS-STARTPTS[v${index}];[0:a]atrim=start=${startTime}:duration=${duration},asetpts=PTS-STARTPTS,${addVolume}[a${index}];`;
    }

    // Remove the last semicolon if needed
    if (filters.endsWith(';')) {
        filters = filters.slice(0, -1);
    }

    // End Proccess of Case multi trim
        
    const concatFilter = cuts[0].map((_, index) => `[v${index}][a${index}]`).join('');
    const concatString = `concat=n=${cuts[0].length}:v=1:a=1[outv][outa]`;
    
    console.log(`ffmpeg -i "${inputFilePath}" -filter_complex "${filters};${concatFilter}${concatString}  ${crop}" -map "[outv]" -map "[outa]" ${outputFilePath}`)
    
    return `ffmpeg -i "${inputFilePath}" -filter_complex "${filters};${concatFilter}${concatString}  ${crop}" -map "[outv]" -map "[outa]" ${outputFilePath}`;
    
}


exports.triming = async (commend) => {

    child.execSync(commend,(error, stdout, stderr) => {

        console.log(error)
        console.log(stdout)
        console.log(stderr)

        if (error) {
        console.error(`Error concatenating videos: ${error.message}`);
        } else if (stderr) {
        console.error(`stderr for concatenation: ${stderr}`);
        } else {
        console.log('Video segments concatenated successfully!');
        }
    });

}

