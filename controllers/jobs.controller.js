const { login } = require('../services/glassdoor')
const { jobQueue } = require('../services/queue')
const short = require('short-uuid')
const { getCVdata } = require('../services/mongodb')
const fs = require('fs')

const processCV = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      console.log('missing params')
      res.status(400).send('bad input parameter')
      return
    }

    let loginRes = await login(email, password)

    if (loginRes) {
      let id = short.generate()
      const data = { email, password, id }
      jobQueue.now('download CV', data)
      res.status(200).send({ message: 'job enqueued', id })
    } else {
      console.log('wrong password')
      res.status(404).send('wrong password')
    }
  } catch (err) {
    console.error(err)
    res.status(500).send()
  }
}

const getCV = async (req, res) => {
  try {
    const id = req.params.id
    var filePath = `./downloads/${id}.pdf`
    var fileName = `${id}.pdf`

    if (fs.existsSync(filePath)) {
      res.download(filePath, fileName)
    } else {
      res.status(404).send('File not found. Job not finished.')
    }
  } catch (error) {
    console.error(err)
    res.status(500).send()
  }
}

const checkCV = async (req, res) => {
  try {
    const id = req.params.id
    const cv = await getCVdata(id)

    if (cv.length) {
      res.json(cv)
    } else {
      res.status(404).send()
    }
  } catch (error) {
    console.error(err)
    res.status(500).send()
  }
}

module.exports = {
  processCV,
  getCV,
  checkCV,
}
