const express = require('express')
const  {placeOrder, getOrder, payOrder, getUserOrders, getOrders, deliverOrder} = require('../controllers/orderController')
const {protect, authorize} = require('../middleware/auth')
const router = express.Router()

router.use(protect)

router.route('/')
    .post(placeOrder)
    .get(getUserOrders)

router.route('/:orderId').get(getOrder)
router.route('/:orderId/pay').post(payOrder)

router.route('/admin/orders')
    .get(authorize('admin'), getOrders)


router.route('/:orderId/deliver').put(authorize('admin'), deliverOrder)



module.exports = router
