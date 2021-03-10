const { Router } = require('express')
const Course = require('../models/course')
const router = Router()
const { validationResult } = require('express-validator')

const { courseValidator } = require('../utils/validators')
function isOwner(course, req) {
    return course.userId.toString() === req.user.id
}
router.get('/', async (req, res, next) => {
    try {
        res.status(200)
        const courses = await Course.find().populate('userId', 'email name').select('price img title')


        res.render('courses', {
            title: 'Courses',
            isCourses: true,
            courses,
            userId: req.user ? req.user.id : null
        })
    } catch (error) {
        console.log(error);
    }

})
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', { title: `Course: ${course.title}`, course, layout: 'empty' })
})
router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id)

        if (isOwner(course, req)) {
            return res.render('courseEdit', {
                title: `Edit ${course.title}`,
                course
            })
        }
        return res.redirect('/courses')
    } catch (error) {
        console.log(error);
    }

})
router.post('/edit', courseValidator, async (req, res) => {
    const { id } = req.body

    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(422).redirect(`/${id}/edit?allow=true`)
    }


    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})
router.post('/remove', async (req, res) => {
    try {
        const { id } = req.body
        await Course.deleteOne({ _id: req.body.id, userId: req.user.id })
        res.redirect('/courses')
    } catch (error) {
        console.log(error);
    }

})

module.exports = router