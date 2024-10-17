const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    title: String,
    path: String,
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;