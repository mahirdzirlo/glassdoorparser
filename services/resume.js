const { saveCV } = require('../services/mongodb')
const fs = require('fs')
const path = require('path')

const parsePDF = async (data, id) => {
  data.id = id
  await renameFile(data.filename, data.id)
  return await saveCV(data)
}

const renameFile = async (filename, id) => {
  const downloadPath = path.resolve('./downloads')
  fs.rename(`./downloads/${filename}`, `./downloads/${id}.pdf`, (err) => {
    if (err) throw err
  })
}

module.exports = { parsePDF }
