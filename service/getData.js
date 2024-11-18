const Video = require("../model/video");
const { verifyToken } = require("../utils/createToken");
const path = require("path");


exports.getData = async (videoId,token) => {

    const video = await Video.findById(videoId);
    const user = verifyToken(token)
    const videoPath = path.join(__dirname, `/../uploads/${user.username}/${video.path}`);  

    return { video, user, videoPath }

}