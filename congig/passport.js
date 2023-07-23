const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  // setting LocalStrategy
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email })

      // check if email exits
      if (!user) return done(null, false, req.flash('warning_msg', '電子郵件尚未註冊'))

      // check if password correct
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return done(null, false, req.flash('warning_msg', '電子郵件 或 密碼 錯誤'))
      }

      return done(null, user)

    } catch (err) {
      console.warn(err)
    }
  }))
  // setting FacebookStrategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { email, name } = profile._json
      const user = await User.findOne({ email })

      if (user) return done(null, user)

      // 如果facebook email不存在
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(randomPassword, salt)
      const newUser = await User.create({ name, email, password: hash })
      return done(null, newUser)

    } catch (err) {
      console.warn(err)
    }

  }))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}