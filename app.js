const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes/index')
const flash = require('connect-flash')

require('./config/mongoose')

const port = process.env.PORT
const app = express()

// setting template engine
app.engine('hbs', exphbs.create({
  defaultLayout: 'main', extname: '.hbs'
}).engine)
app.set('view engine', 'hbs')
app.set('views', './views')

// setting express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// setting body-paesr
app.use(express.urlencoded({ extended: true }))

// setting methodOverride
app.use(methodOverride('_method'))

// call passport
usePassport(app)

// setting flash
app.use(flash())

// middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

// setting routes
app.use(routes)

app.listen(port, () => {
  console.log(`It's running on http://localhost:${port}`)
})