const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,  // Making it mandatory
    },
    title: {
        type: String,
        required: [true, "Title is required"], // Making it mandatory
    },
    date: {
        type: Date,
        default: Date.now,  // Automatically set the current date when a session is created
    },
    duration: {
        type: Number, // Duration in minutes or seconds
    },
    description: String, // Optional field for additional info
    videos: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Video', // Assuming you have a Video model
    }],
});

const Session = mongoose.model('Session',sessionSchema);

module.exports = Session;