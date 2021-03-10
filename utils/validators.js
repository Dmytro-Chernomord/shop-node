
const { body } = require('express-validator')
const User = require('../models/user')

exports.registerValidator = [
    body('name', 'Name min. 3').isLength({ min: 3, max: 56 }),
    body('remail').isEmail().withMessage('Email incorrect').custom(async (value, { req }) => {
        try {
            const candidate = await User.findOne({ email: value })
            if (candidate) {
                return Promise.reject('Email already exist')
            }

        } catch (error) {
            console.log(error);
        }
    }).normalizeEmail(),
    body('rpassword', 'Password incorrect').isLength({ min: 6, max: 56 }).isAlphanumeric().trim(),
    body('confirmpassword').custom((value, { req }) => {
        if (value !== req.body.rpassword) {
            throw new Error('Password do not matched')
        }
        return true
    }).trim(),

]

exports.loginValidator = [
    body('email').isEmail().withMessage('Email incorrect'),
    body('password', 'Password incorrect min. length 6 ').isLength({ min: 6, max: 56 }).isAlphanumeric(),
]

exports.courseValidator = [
    body('title').isLength({ min: 3 }).withMessage('min. length  3').trim(),
    body('price').isNumeric().withMessage('Please enter number').trim(),
    body('img', 'Please enter correct url').isURL()
]


exports.changePasswordValidator = [
    body('rpassword', 'Password incorrect').isLength({ min: 6, max: 56 }).isAlphanumeric().trim(),
    body('confirmpassword').custom((value, { req }) => {
        if (value !== req.body.rpassword) {
            throw new Error('Password do not matched')
        }
        return true
    }).trim(),
]