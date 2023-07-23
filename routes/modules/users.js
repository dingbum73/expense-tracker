const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../../models/user')
const bcrypt = require('bcryptjs')


// login

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureMessage: true,
  failureFlash: true
}))


// register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []

    // 確認是否有空資料 
    if (!name || !email || !password) { errors.push({ message: '全部都是必填欄位' }) }

    //  確認password與confirmPassword是否相同
    if (password !== confirmPassword) { errors.push({ message: '密碼與確認密碼不相符！' }) }

    // 確認是否有errors
    if (errors.length) { console.log(errors); return res.render('register', { errors, name, email, password, confirmPassword }) }

    //  確認email是否註冊過
    const isUser = await User.findOne({ email })
    if (isUser) { errors.push({ message: '此email已經註冊過了' }); return res.render('register', { errors, name, email, password, confirmPassword }) }

    // setting hash and create user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await User.create({ name, email, password: hash })

    req.flash('success_msg', '註冊成功！立即登入使用吧！')
    res.redirect('/users/login')
  } catch (err) {
    console.warn(err)
  }
})


// logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return console.warn(err)
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/users/login')
  });
});

module.exports = router