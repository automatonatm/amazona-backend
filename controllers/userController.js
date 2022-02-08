const User = require('../models/User')
const catchAsync = require('express-async-handler')
const data = require('../data')

const userSeed = catchAsync(async (req, res, next) => {
    const createUsers = await User.insertMany(data.users)

    res.status(200).json({
        status: true,
        users: createUsers
    })

})

module.exports = {
    userSeed
}