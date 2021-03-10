const { Router } = require('express')
const Course = require('../models/course')
// const Card = require('../models/cardModel')
const router = Router()
const auth = require('../middleware/auth')

function mapBag(items) {
    return items.map(el => ({ quantity: el.quantity, title: el.courseId.title, img: el.courseId.img, price: el.courseId.price, id: el.courseId._id }))
}
function calculate(arr) {
    return arr.reduce(function (accumulator, currentValue) {
        return {
            price: accumulator.price + currentValue.price * currentValue.quantity,
            quantity: accumulator.quantity + currentValue.quantity
        }
    }, { quantity: 0, price: 0 });
}
router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToBag(course)
    res.redirect('/bag')
})

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate('bag.items.courseId').execPopulate()
    const bag = mapBag(user.bag.items)
    const result = calculate(bag)
    res.render('bag', {
        title: 'Bag',
        bag, quantity: result.quantity,
        price: result.price,
        isBag: true
    })

})
router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromProduct(req.params.id)
    const user = await req.user.populate('bag.items.courseId').execPopulate()
    const products = mapBag(user.bag.items)
    const result = calculate(products)
    const resu = { products: mapBag(user.bag.items), ...result }

    res.status(200).json({ ...resu })
})
module.exports = router