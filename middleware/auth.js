const jwt = require('jsonwebtoken');
const Async = require('express-async-handler');
const AppError = require('../utils/appError.js');
const User = require('../models/User.js');



//Protect routes
exports.protect = Async(async (req, res, next) => {


    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        //set token from header
        token = req.headers.authorization.split(' ')[1];

    } else if (req.cookies.amazona_token) {
        //set token from logout
        token = req.cookies.amazona_token;
    }


    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id)

        req.user = user

        if (!user) return next(new AppError('Authentication Failed', 401));

        next()
    } catch (err) {
        return next(new AppError('Authentication Failed', 401))
    }

});



//ACL Access control
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('Forbidden', 403))
        }
        next()
    }

};


exports.checkOwnerShip = (ownerId, req) => {
    return ownerId === req.user.id || req.user.role === 'admin'
};





