const express = require('express')
const  {getCategories} = require('../controllers/productController')
const router = express.Router()

router.route('/').get(getCategories)

module.exports = router
