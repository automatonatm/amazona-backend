const express = require('express')
const  {userSeed} = require('../controllers/userController')
const router = express.Router()

router.route('/seed').get(userSeed)

module.exports = router
