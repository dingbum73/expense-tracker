const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  },
  categoryId: {
    type: Number,
    required: true
  },
  createdAtAuto: {
    // 系統戳記時間
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Record', recordSchema)