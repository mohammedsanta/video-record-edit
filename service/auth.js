const asyncHandler = require('express-async-handler');
const User = require('../model/User');
const { createToken } = require('../utils/createToken');


// Service for login
exports.login = asyncHandler(async (req,res,next) => {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if(!user) {
        return res.status(404).json({
            message: 'user not found'
        })
    }

    const token = createToken(user);

    res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000, // 1 hour expiration
        sameSite: 'Strict' // Prevents CSRF attacks
    });

    res.status(200).json({
        user,
        token
    })

});


// Service for sginup
exports.signup = asyncHandler(async (req,res,next) => {

    const { username, password } = req.body;

    console.log(req.body)

    const createUser = await User.create({
        username,
        password
    });

    res.json(createUser);

});
