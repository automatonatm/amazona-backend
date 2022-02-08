const catchAsync = require('express-async-handler')
const Order = require('../models/Order')
const AppError = require('../utils/appError.js')
const {checkOwnerShip} = require('../middleware/auth')

// @desc create a new account
// @route POST /api/v1/order
// @access PUBLIC
const placeOrder = catchAsync(async (req, res, next) => {

    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    } = req.body

    if(orderItems.length === 0) {
        return next(new AppError('cart is Empty', 400))
    }

    const order = await Order.create({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        user: req.user.id
    })

    res.status(201).json({
        status: true,
        data: order
    })


})


// @desc create a new account
// @route POST /api/v1/orders/:orderId
// @access PUBLIC
const getOrder = catchAsync(async (req, res, next) => {

    const order = await Order.findById(req.params.orderId)

    if(!order) return  next(new AppError('Order Not Found', 404))

    if(!checkOwnerShip(order.user.id.toString(), req)) return next(new AppError('Access Denied', 403));

    res.status(200).json({
        status: true,
        data: order
    })
})


// @desc create a new account
// @route POST /api/v1/orders/:orderId
// @access PUBLIC
const deliverOrder = catchAsync(async (req, res, next) => {

    const order = await Order.findById(req.params.orderId)

    if(!order) return  next(new AppError('Order Not Found', 404))

    if(!checkOwnerShip(order.user.id.toString(), req)) return next(new AppError('Access Denied', 403));

    if(!order.isPaid) {
        return next(new AppError('Order not paid', 400))
    }

    order.isDelivered = true
    order.deliveredAt = Date.now()

    const saveOrder = await order.save()

    res.status(200).json({
        status: true,
        data: saveOrder
    })
})


// @desc create a new account
// @route POST /api/v1/orders/:orderId/pay
// @access PUBLIC
const payOrder = catchAsync(async (req, res, next) => {

    const {
        id,
        status,
        update_time,
        email_address
    } = req.body


    const order = await Order.findById(req.params.orderId)

    if(!order) return  next(new AppError('Order Not Found', 404))

    if(!checkOwnerShip(order.user.id.toString(), req)) return next(new AppError('Access Denied', 403));

    if(status !== 'COMPLETED') {
        return next(new AppError('An unknown error occurred', 400));
    }

    order.isPaid = true
    order.payedAt = Date.now()
    order.paymentResult = {
        id,
        status,
        update_time,
        email_address
    }

    const updatedOrder = await order.save()

    res.status(200).json({
        status: true,
        data: updatedOrder
    })
})


// @desc get user orders
// @route POST /api/v1/orders/:orderId
// @access PUBLIC
const getUserOrders = catchAsync(async (req, res, next) => {

    const orders = await Order.find({user: req.user.id})

  //  if(!order) return  next(new AppError('Order Not Found', 404))

    res.status(200).json({
        status: true,
        data: orders
    })
})


// @desc get  orders
// @route POST /api/v1/orders/
// @access PUBLIC
const getOrders = catchAsync(async (req, res, next) => {

    const orders = await Order.find().populate('user')

    res.status(200).json({
        status: true,
        data: orders
    })
})




module.exports = {
    placeOrder,
    getOrder,
    payOrder,
    getUserOrders,
    getOrders,
    deliverOrder
}