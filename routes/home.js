const { Router } = require('express')

const router = Router()

router.get('/', (req, res, next) => {
    res.status(200)
    res.render('index', { title: 'Main', isMain: true })
})

module.exports = router