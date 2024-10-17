const mongoose = require('mongoose');

// Connection string
const uri = 'mongodb://127.0.0.1:27017/videoedit'; // or your Atlas connection string

// Connect to MongoDB
exports.connection = () => {

    mongoose.connect(uri)
        .then(() => {
            console.log('MongoDB connected successfully!');
            
            // Now you can use your models and perform database operations
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
        });

}