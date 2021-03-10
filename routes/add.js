const { Router } = require('express')
const { validationResult } = require('express-validator')
const { courseValidator } = require('../utils/validators')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')

router.get('/', auth, (req, res, next) => {
    res.status(200)
    res.render('add', { title: 'Add', isAdd: true, })

})

router.post('/', auth, courseValidator, async (req, res) => {
    // const course = new Course(req.body.title, req.body.price, req.body.img);
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(422).render("add", {
            title: 'Add',
            isAdd: true,
            error: error.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
            }
        })
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })
    try {
        await course.save()
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
})

module.exports = router