const express = require('express')
const path = require('path')
const csurf = require('csurf')
const flash = require('connect-flash')
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const helmet = require('helmet')
require('dotenv').config({ path: path.join(__dirname, '/.env') })


const MongoStore = require('connect-mongodb-session')(session)
const expressHandlebars = require('express-handlebars');
const homeRouter = require('./routes/home')
const addRouter = require('./routes/add')
const bagRouter = require('./routes/bag')
const coursesRouter = require('./routes/courses')
const ordersRouter = require('./routes/orders')
const loginRouter = require('./routes/auth-routes')
const varMiddleware = require('./middleware/variable')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')

const { MONGO_DB_URI, SESSION_SECRET } = process.env
const app = express();
const hbs = expressHandlebars.create({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: require('./utils/hbs-helpers.js'),
    handlebars: allowInsecurePrototypeAccess(Handlebars),

})
const store = new MongoStore({
    collection: 'sessions',
    uri: MONGO_DB_URI,
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views')



app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csurf())
// app.use(helmet())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)
//for post methods
app.use('/', homeRouter)
app.use('/courses', coursesRouter)
app.use('/add', addRouter)
app.use('/bag', bagRouter)
app.use('/orders', ordersRouter)
app.use('/auth', loginRouter)
app.use(errorHandler)

async function start() {
    try {
        await mongoose.connect(MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        const PORT = process.env.PORT || 4040
        app.listen(PORT, () => {
            console.log("Server is running", PORT);
        })
    } catch (error) {
        console.log(error);
    }

}

start()







// app.get('/', (req, res, next) => {
//     res.status(200)
//     // res.sendFile(path.join(__dirname, 'views', 'index.html'))
//     res.render('index', { title: 'Main', isMain: true })
// })

// app.get('/courses', (req, res, next) => {
//     res.status(200)
//     // res.sendFile(path.join(__dirname, 'views', 'about.html'))
//     res.render('courses', { title: 'Courses', isCourses: true })
// })

// app.get('/add', (req, res, next) => {
//     res.status(200)
//     // res.sendFile(path.join(__dirname, 'views', 'about.html'))
//     res.render('add', { title: 'Add', isAdd: true })
// })



