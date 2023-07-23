const express = require('express')
const router = express.Router()
const Record = require('../../models/record')


// CRUD_get(create瀏覽)
router.get('/new', (req, res) => {
  res.render('new')
})

// CRUD_post(create)
router.post('', async (req, res) => {
  const userId = req.user._id
  const { name, createdAt, categoryId, amount } = req.body
  if (categoryId === '0') {
    return res.render('new', { name, createdAt, categoryId, amount })
  }
  try {
    await Record.create({
      name, createdAt, categoryId, amount, userId
    })
    res.redirect('/')
  } catch (err) {
    console.warn(err)
  }
})

// detail
router.get('/:id', async (req, res) => {
  try {
    const recordId = req.params.id
    const userId = req.user._id
    const record = await Record.findOne({ _id: recordId, userId }).lean()
    const categoryIdOne = record.categoryId === 1
    const categoryIdTwo = record.categoryId === 2
    const categoryIdThree = record.categoryId === 3
    const categoryIdFour = record.categoryId === 4
    const categoryIdFive = record.categoryId === 5
    res.render('detail', { record, categoryIdOne, categoryIdTwo, categoryIdThree, categoryIdFour, categoryIdFive })
  } catch (err) {
    console.warn(err)
  }
})


// CRUD_Update_use PUT
router.get('/:id/edit', async (req, res) => {
  try {
    const recordId = req.params.id
    const userId = req.user._id
    const record = await Record.findOne({ _id: recordId, userId }).lean()
    const categoryIdOne = record.categoryId === 1
    const categoryIdTwo = record.categoryId === 2
    const categoryIdThree = record.categoryId === 3
    const categoryIdFour = record.categoryId === 4
    const categoryIdFive = record.categoryId === 5
    res.render('edit', { record, categoryIdOne, categoryIdTwo, categoryIdThree, categoryIdFour, categoryIdFive })
  } catch (err) {
    console.warn(err)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const recordId = req.params.id
    const userId = req.user._id
    const { name, createdAt, categoryId, amount } = req.body
    const record = await Record.findOne({ _id: recordId, userId })
    record.name = name
    record.createdAt = createdAt
    record.categoryId = categoryId
    record.amount = amount
    await record.save()
    res.redirect(`/records/${recordId}`)
  } catch (err) {
    console.warn(err)
  }
})

// CRUD_DELETE
router.delete('/:id', async (req, res) => {
  try {
    const recordId = req.params.id
    const userId = req.user._id
    await Record.deleteOne({ _id: recordId, userId })
    res.redirect('/')
  } catch (err) {
    console.warn(err)
  }
})




module.exports = router