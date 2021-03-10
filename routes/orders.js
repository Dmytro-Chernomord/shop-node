const { Router } = require('express')
const Order = require('../models/order')
const router = Router()
const auth = require('../middleware/auth')
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id
        }).populate('user.userId')

        const renderOrders = orders.map(el => {
            return ({
                name: el.user.name,
                date: el.user.date,
                id: el._id,
                products: el.products,
                total: el.products.reduce((acc, el) => {
                    return acc += el.price
                }, 0)
            })
        })
        res.render('orders', {
            isOrders: true,
            title: 'Orders',
            renderOrders
        })
    } catch (error) {
        console.log(error);
    }
})

router.post('/', auth, async (req, res) => {

    try {
        const user = await req.user
            .populate('bag.items.courseId').execPopulate()
        const items = user.bag.items.map((el, idx) => ({
            _id: el._id,
            price: el.courseId.price,
            title: el.courseId.title,
            quantity: user.bag.items[idx].quantity
        }))
        const newOrder = new Order({
            products: [...items],
            user: {
                userId: user._id,
                name: user.name
            }
        })
        await newOrder.save()
        await req.user.clearBag()
        res.redirect('/orders')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router