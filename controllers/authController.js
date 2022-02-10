const catchAsync = require('express-async-handler')
const User = require('../models/User')
const AppError = require('../utils/appError.js')
const crypto = require('crypto');



// @desc create a new account
// @route POST /api/v1/auth/register
// @access PUBLIC
const signUp = catchAsync(async (req, res, next) => {

    const {
        email,
        name,
        password,
    } = req.body;

    console.log(req.body)


    if (
        !email ||
        !name ||
        !password
    ) {
        return next(new AppError("Please fill  out all form field", 400));
    }




    const user = await User.create({
        name,
        email,
        password,
    });


    sendTokenResponse(user, 201, res, req);


});


// @desc sign in as a user
// @route POST /api/v1/auth/signin
// @access Public
const signIn = catchAsync(async (req, res, next) => {

    const {email, password} = req.body;


    //validate
    if (!password || !email) return next(new AppError('Please fill all form fields', 400));

    // Check for match in DB
    //check for user
    const user = await User.findOne({email}).select('+password');

    if (!user) return next(new AppError('Invalid Credentials', 401));


    //check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new AppError('Invalid Credentials', 401));
    }


    sendTokenResponse(user, 200, res, req)

});


// @desc Get logged in user data
// @route POST /api/v1/auth/me
// @access Private
const currentUserProfile = catchAsync(async (req, res) => {

    const user = await User.findById(req.user.id).select("-__v -registrationToken -registrationTokenExpiredAt -resetPasswordToken -resetPasswordTokenExpiredAt")

    res.status(200).json({
        success: true,
        data: user
    })

})


const sendTokenResponse = (user, statusCode, res, req) => {

    //create Token

    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    };





    if (process.env.NODE_ENV === 'production') {
        options.httpOnly = true;
        options.secure = true;
    }



    //Heroku
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        options.httpOnly = true;
        options.secure = true;
    }





    console.log(token)

    res.status(200)
        .cookie('amazona_token', token, options)
        .json({status: true, token})
}



// @desc  Logout / Clear Cookies
// @route POST /api/v1/auth/logout
// @access Private
const logOut = catchAsync(async (req, res, next) => {

    res.cookie('amazona_token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true
    });

    return res.status(200)
        .json({
            status: true
        })
});

module.exports = {
    signUp,
    signIn,
    currentUserProfile,
    logOut
}

