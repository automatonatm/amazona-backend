const express = require('express')

const  {getAllProducts, getProduct, productSeed, createProduct, updateProduct, uploader, uploadImage, deleteProduct } = require('../controllers/productController')

const router = express.Router()

const {protect, authorize} = require('../middleware/auth')

const { body, check, validationResult } = require('express-validator');

const createProductValidator = () => {
    return [
        check('name')
            .notEmpty()
            .withMessage('name is required'),
        check('brand')
            .notEmpty()
            .withMessage('brand is required'),
        check('category')
            .notEmpty()
            .withMessage('category is required'),
    ]
}



router.route('/seed')
    .get(productSeed)

router.route('/')
    .get(getAllProducts)
    .post(protect, authorize('admin'),  createProduct)

router.route('/:productId')
    .get(getProduct)
    .put(protect, authorize('admin'),  updateProduct)
    .delete(protect, authorize('admin'), deleteProduct)


router.route('/:productId/uploads')
    .put(protect, authorize('admin'), uploader, uploadImage)




module.exports = router
