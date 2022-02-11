const catchAsync = require('express-async-handler')
const AppError = require('../utils/appError')
const data = require('../data')
const Product = require('../models/Product')

const { validationResult } = require('express-validator');

const multer = require("multer");




const productSeed = catchAsync(async (req, res, next) => {

    const createProducts = await Product.insertMany(data.products)

    res.status(200).json({
        status: true,
        users: createProducts
    })
})


const getAllProducts = catchAsync(async (req, res, next) => {


   // const {name} = req.query

    let filter = {}

    const name = req.query.name || ''

    if(name) {
        filter = {...filter, name: {$regex : name, $options: 'i'}}
    }

    const products = await Product.find(filter)

    res.status(200).json({
        status: true,
        data: products
    })

})


const getProduct = catchAsync(async (req, res, next) => {

    const {productId} = req.params
    
    const product = await Product.findById(productId)

    if(!product) return next(new AppError('Product not found', 404))


    res.status(200).json({
        status: true,
        data: product
    })


})


const createProduct = catchAsync(async (req, res, next) => {

    const {name, brand, category, description, price, countInStock, image} = req.body

   /* const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ status: false, errors: errors.array() });
    }*/


    const product = await Product.create({
        name,
        price,
        brand,
        category,
        description,
        countInStock,
        image
    })



    res.status(200).json({
        status: true,
        users: product
    })


})


const updateProduct = catchAsync(async (req, res, next) => {

    const {productId} = req.params

    const {name, brand, category, description, price, countInStock, image} = req.body




    const product = await Product.findById(productId)

    if(!product) return next(new AppError('Product not found', 404))

    product.name = name
    product.brand = brand
    product.category = category
    product.description = description
    product.price = price
    product.countInStock = countInStock
    product.image = image



    const saveProduct = await product.save()


    res.status(200).json({
        status: true,
        data: saveProduct
    })


})

const deleteProduct = catchAsync(async (req, res, next) => {

    const {productId} = req.params

    const product = await Product.findById(productId)

    if(!product) return next(new AppError('Product not found', 404))

    await product.remove();

    res.status(204).json({
        success: true,
    });


})



const multerStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'public/products',  )
    },

    filename:  (req, file, cb) => {
        const  {productId} = req.params
        const extension = file.mimetype.split('/')[1];
        cb(null, `image-${productId}.${extension}`)
    }

});



const multerFilter = (req, file, cb) => {


        const whitelist = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp'
        ]

        if(whitelist.includes(file.mimetype)) {
            cb(null, true)
        }else {
            cb(new AppError('Invalid Image Uploaded', 400), false)
        }

};




const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})



const uploadImage  = catchAsync(async (req, res, next) => {

    const {filename} = req.file

    const {productId} = req.params



    const product = await Product.findById(productId)


    if(!product) return next(new AppError('Product not found', 404))

    product.image = filename


    await product.save({validateBeforeSave: false})


    res.status(200).json({
        status: true,
        data: filename
    })

})



const uploader = upload.single('image');


module.exports = {
    getAllProducts,
    getProduct,
    productSeed,
    createProduct,
    updateProduct,
    uploader,
    uploadImage,
    deleteProduct
}