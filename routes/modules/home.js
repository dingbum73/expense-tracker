const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

const CATEGORY = {
  1: `<i class="fa-solid fa-house"></i>`,
  2: `<i class="fa-solid fa-van-shuttle"></i>`,
  3: `<i class="fa-solid fa-face-grin-beam"></i>`,
  4: `<i class="fa-solid fa-utensils"></i>`,
  5: `<i class="fa-solid fa-pen"></i>`
}

// CRUD_get(首頁瀏覽)
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const categories = await Category.find().lean().sort({ 'id': 'asc' })
    const records = await Record.find({ userId }).lean().sort({ 'createdAtAuto': -1 })
    let totalAmount = 0
    for (let i = 0; i < records.length; i++) {
      totalAmount += records[i].amount
      records[i].iconHTML = CATEGORY[records[i].categoryId]
    }

    res.render('index', { categories, records, totalAmount })
  } catch (err) {
    console.warn(err)
  }
})

module.exports = router