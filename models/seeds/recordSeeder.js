const bcrypt = require('bcryptjs')
const Record = require('../record')
const User = require('../user')
const expenseSeed = require('../expenseSeed.json')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const SEED_USER = {
  "name": 'test',
  "email": 'test@testmail.com',
  "password": "12345678"
}




db.once('open', async () => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(SEED_USER.password, salt)
    const userId = await User.create({ "name": SEED_USER.name, "email": SEED_USER.email, "password": hash })
    await Promise.all(expenseSeed.result.map(seed => {
      return Record.create({
        "name": seed.name,
        "createdAt": seed.createdAt,
        "amount": seed.amount,
        "categoryId": seed.categoryId,
        "userId": userId
      });
    }));
    console.log('recordSeeder done!')
  } catch (err) {
    console.warn(err);
  }
  process.exit()
})