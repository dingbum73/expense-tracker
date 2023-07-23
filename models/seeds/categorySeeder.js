if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const db = require('../../config/mongoose')
const Category = require('../category')

const categorySeed = [
  { "id": 1, "name": "家居物業" },
  { "id": 2, "name": "交通出行" },
  { "id": 3, "name": "休閒娛樂" },
  { "id": 4, "name": "餐飲食品" },
  { "id": 5, "name": "其他" },
]


db.once('open', async () => {
  try {
    await Promise.all(categorySeed.map(seed => {
      return Category.create({
        "id": seed.id,
        "name": seed.name
      });
    }));
    console.log('categorySeeder done!')
  } catch (err) {
    console.warn(err);
  }
  process.exit()
})