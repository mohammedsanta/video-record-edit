const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'title required']
    },
    path: {
        type: String,
        required: [true, 'path required']
    },
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;