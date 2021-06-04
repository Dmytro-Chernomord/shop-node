const { Router } = require('express')
const data = require('../data/sample.json');

const router = Router()

router.get('/', (req, res, next) => {
    res.status(200)
    res.json(data)
})

module.exports = router