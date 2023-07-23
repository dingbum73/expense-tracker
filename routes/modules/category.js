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

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.user._id
    const categories = await Category.find().lean().sort({ 'id': 'asc' })
    // 找出篩選類別的名字，丟給HBS
    const category = await Category.find({ id }).lean()
    const categoryName = category[0].name

    const records = await Record.find({ categoryId: id, userId }).lean().sort({ 'createdAtAuto': -1 }) //讓最新輸入的一筆在最上方
    let totalAmount = 0
    for (let i = 0; i < records.length; i++) {
      totalAmount += records[i].amount
      records[i].iconHTML = CATEGORY[records[i].categoryId]
    }
    res.render('index', { categories, records, totalAmount, categoryName })
  } catch (err) {
    console.warn(err)
  }
})

module.exports = router