const asyncHandler = require('express-async-handler');
const { verifyToken } = require('../utils/createToken');
const Session = require('../model/Session');
const Video = require('../model/video');

exports.createSession = asyncHandler(async (req,res,next) => {

    const { title } = req.body;
    const username = verifyToken(req.cookies.token);

    // Create a new session
    const newSession = new Session({
        username: username.id,
        title,
        // duration,
        // description,
        videos: [],
    });
    

    // Save the session to the database
    await newSession.save();

    res.json({ newSession });

});

exports.sessions = asyncHandler(async (req,res,next) => {

    const data = verifyToken(req.cookies.token);
    const sessions = await Session.find({ username: data.id });
    res.json({ sessions });

})

exports.deleteSession = asyncHandler(async (req,res,next) => {

    const session = await Session.findOneAndDelete({
        _id: req.params.id,
      });

    if(!session) {
        res.json({ message: 'session hasn\'t been deleted' });
    }

    res.json({ message: 'session has been deleted' });

});

exports.updateSession = asyncHandler(async (req,res,next) => {

    const sessionUpdated = await Session.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            // Update fields here
            title: req.body.title
            // For example:
            // description: req.body.description,
            // views: req.body.views
        },
        {
            new: true, // Returns the updated document
            upsert: false // Creates a new document if no match is found (set to true if you want this behavior)
        }
    );
    
    if(!sessionUpdated) {
        res.json({ message: 'Session hasn\'t been Updated' });
    }

    res.json({ message: 'Session has been edit',
        success: true,
        data: sessionUpdated
    });

});

exports.addVideoToSession = asyncHandler(async (req,res,next) => {

    const sessionId = req.body.sessionId;
    const newVideoId = req.body.video;
    
    // Find the session by ID
    const session = await Session.findById(sessionId);
    
    // Check if the session exists
    if (!session) {
        return res.status(404).json({ message: "Session not found." });
    }
    
    // Check if the video ID already exists in the array
    if (!session.videos.includes(newVideoId)) {
        // Add the new video ID to the videos array
        session.videos.push(newVideoId);
    }
    
    // Log the updated unique videos
    console.log(session.videos);
    
    // Save the updated session to the database
    await session.save();

    res.status(200).json({ message: "Video has been added." });

});

exports.deleteFromSession = asyncHandler(async (req,res,next) => {

    const sessionId = req.body.sessionId;
    const videoId = req.body.video;
    
    // Find the session by ID
    const session = await Session.findById(sessionId);
    
    // Check if the session exists
    if (!session) {
        return res.status(404).json({ message: "Session not found." });
    }
    
    // Check if the video ID already exists in the array
    if (session.videos.includes(videoId)) {
        // Add the new video ID to the videos array
        session.videos.pop(videoId);
    }
    
    // Log the updated unique videos
    console.log(session.videos);
    
    // Save the updated session to the database
    await session.save();

    res.status(200).json({ message: "Video has been added." });

});

exports.getVideosOfSession = asyncHandler(async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId; // Get session ID from URL params
        const getSession = await Session.findById(sessionId); // Use findById for clarity

        if (!getSession) {
            return res.status(404).json({ message: 'Session not found' }); // Handle not found
        }

        const getVideo = async (id) => {
            return await Video.findById(id)
        }

        const updateSession = async (id) => {

            getSession.videos.forEach(v => {
                if(getSession.videos.includes(v)) {
                    // Add the new video ID to the videos array
                    getSession.videos.pop(v);
                }
                console.log(v)
            })

            getSession.save();

            // return await Video.findByIdAndUpdate(id)
        }

        const videos = getSession.videos || []; // Default to an empty array if no videos

        
        [getSession].forEach(vid => {
            vid.videos.forEach(async v => {
                if(!(await getVideo(v))) {
                    await updateSession(v);
                    console.log('remove from array videos',v)
                }
            })
        })

        res.status(200).json({ videos });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' }); // Handle server errors
    }
});