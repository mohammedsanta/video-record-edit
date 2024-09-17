const child  = require('child_process');


exports.codetrim = (inputFilePath = 'test.mp4',outputFilePath = 'output.mp4',cuts,addCrop = 'false',volume) => {

    var addCrop;
    var crop = ``;
    let addVolume;
    addVolume = volume ? volume : '';
    
    addCrop ? crop = ',crop=405:720' : '' ;

    if(cuts[0].length == 1) {

        return `ffmpeg -i "${inputFilePath}" -filter_complex "[0:v]trim=start=${cuts[0]}:duration=${cuts[1]},setpts=PTS-STARTPTS[v0];[0:a]atrim=start=${cuts[0]}:duration=${cuts[1]},asetpts=PTS-STARTPTS,volume=${addVolume}[a0];[v0][a0]concat=n=1:v=1:a=1[outv][outa]"  -map "[outv]" -map "[outa]" ${outputFilePath}`;

    }

    let filters = cuts.map((cut, index) => {

        const startTime = cuts[0][index];
        const duration = cuts[1][index];

        return `[0:v]trim=start=${startTime}:duration=${duration},setpts=PTS-STARTPTS[v${index}];[0:a]atrim=start=${startTime}:duration=${duration},asetpts=PTS-STARTPTS,volume=${addVolume}[a${index}]`;
    }).join(';');
    
    const concatFilter = cuts.map((_, index) => `[v${index}][a${index}]`).join('');
    const concatString = `concat=n=${cuts.length}:v=1:a=1[outv][outa]`;
    
    return `ffmpeg -i "${inputFilePath}" -filter_complex "${filters};${concatFilter}${concatString}" -map "[outv]" -map "[outa]" ${outputFilePath}`;
    
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

