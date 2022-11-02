const mongoose = require('mongoose')
const { host, user, pass, name } = require('../config/mongo.config')

const uri = `mongodb+srv://${user}:${pass}@${host}/${name}?retryWrites=true&w=majority`

mongoose.connect(uri, { useNewUrlParser: true })
// mongoose.set("debug", true);
const db = mongoose.connection
db.once('open', (_) => {
  console.log('Database connected:', uri)
})

db.on('error', (err) => {
  console.error('connection error:', err)
})

module.exports = { db, uri }
