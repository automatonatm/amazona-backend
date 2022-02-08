const express = require('express')
const  {signIn, signUp, currentUserProfile, logOut } = require('../controllers/authController')
const router = express.Router()
const {protect} = require('../middleware/auth')

router.route('/signin').post(signIn)
router.route('/signup').post(signUp)
router.route('/logout').post(logOut)
router.route('/me').get(protect, currentUserProfile)

module.exports = router


