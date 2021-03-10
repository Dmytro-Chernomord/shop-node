const { Router } = require('express')
const User = require('../models/user')
const { validationResult } = require('express-validator')
const router = Router();
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const { SENDFRID_API_KEY } = process.env
const registrationEmail = require('../email/registration');
const resetPasswordMail = require('../email/resetPassword');

const trsansporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: SENDFRID_API_KEY }
}))
const { registerValidator, loginValidator, changePasswordValidator } = require('../utils/validators');
const { isError } = require('util');

router.get('/', async (req, res) => {
    res.render('auth/login', {
        title: 'Login',
        isLogin: true,
        registerError: req.flash('registerError'),
        loginError: req.flash('loginError')
    })
})
router.get('/logout', auth, async (req, res) => {
    // req.session.isAuthenticated = false
    req.session.destroy(() => {
        res.redirect('/auth/')
    })
})
router.post('/login', loginValidator, async (req, res) => {
    // req.headers = {
    //     'X-XSRF-TOKEN': req.csrfToken // <-- is the csrf token as a header
    // }
    try {
        const { email, password } = req.body
        const candidate = await User.findOne({ email })
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array()[0]);
            req.flash('loginError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/#login')
        }

        if (candidate) {
            const isSame = await bcrypt.compare(password, candidate.password)
            if (isSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Data incorrect')
                res.redirect('/auth/#login')
            }
        } else {
            res.redirect('/auth/#register')
        }
    } catch (error) {
        console.log(error);
    }
}
)
router.post('/register', registerValidator, async (req, res) => {
    try {
        const { remail, rpassword, name } = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors.array()[0]);
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/#register')
        }

        const hashPassword = await bcrypt.hash(rpassword, 10)
        const user = new User({
            email: remail, password: hashPassword, name, bag: { items: [] }
        })
        await user.save()
        res.redirect('/auth/#login')
        // await trsansporter.sendMail(registrationEmail(remail))

    } catch (error) {
        console.log(error);
    }
}
)
router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: "Forgot password",
        forgotError: req.flash('forgotError')
    })
})
router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('forgotError', "Something went wrong..., please try again later")
                return res.redirect('/auth/reset')
            }
            const token = buffer.toString('hex')
            console.log(req.body.email);
            const candidate = await User.findOne({ email: req.body.email })
            if (candidate) {
                candidate.resetToken = token,
                    candidate.resetTokenExp = Date.now() + 60 * 60 * 1000,
                    await candidate.save()
                await trsansporter.sendMail(resetPasswordMail(candidate.email, token))
                return res.redirect('/auth')
            } else {
                req.flash('forgotError', "Email not exist")
                return res.redirect('/auth/reset')
            }
        })
    } catch (error) {
        console.log(error);
    }
})
router.get('/resetPassword/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth')
    }
    const user = await User.findOne({ resetToken: req.params.token, resetTokenExp: { $gt: Date.now() } })
    if (!user) {
        res.redirect('/auth')
    } else {
        return res.render('auth/resetPassword', {
            title: "Forgot password",
            forgotError: req.flash('forgotError'),
            userId: user.id,
            token: req.params.token
        })
    }
})
router.post('/resetPassword', async (req, res) => {
    const user = await User.findOne({
        _id: req.body.userId,
        resetToken: req.body.token,
        resetTokenExp: { $gt: Date.now() },
    })

    if (!user) {
        req.flash('newPassword', 'Try again')
        return res.redirect('/auth/reset')
    }
    user.password = await bcrypt.hash(req.body.password, 10)
    user.resetToken = undefined
    user.resetTokenExp = undefined
    console.log(user);
    await user.save()
    res.redirect('/auth')
})
module.exports = router