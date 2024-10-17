const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "username is required"]
    },
    password: {
        type: String,
        require: [true, "password is required"]
    }
})

userSchema.pre('save',async function(next) {

    // Only hash the password if it has been modified (or is new)

    if(!this.isModified('password')) return next();

    try {
        
        this.password = await bcrypt.hash(this.password,10);

    } catch (error) {
        next(error)
    }

});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User',userSchema);

module.exports = User;