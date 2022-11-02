const Agenda = require('agenda')
const { uri } = require('../connections/mongo')
const { parsePDF } = require('../services/resume')
const { download } = require('../services/glassdoor')
const moment = require('moment')

const jobQueue = new Agenda({
  db: {
    address: uri,
    options: { useNewUrlParser: true },
    collection: 'jobs',
  },
})

jobQueue.define('download CV', async (job, done) => {
  const result = await downloadCV(job)
  if (!result) return done('failed')
  done()
})

jobQueue.start()

jobQueue.on('start', (job) => {
  console.log('Job %s starting', job.attrs.name)
})

jobQueue.on('complete', (job) => {
  console.log(`Job ${job.attrs.name} finished`)
  if (!job.attrs.failReason) {
    job.remove()
    console.log('Removing successful job from queue.')
  } else {
    if (job.attrs.failCount < 5) {
      //retry 4 times
      console.log('fail job reason', job.attrs.failReason)
      console.log('Resceduling failed job.')
      job.attrs.nextRunAt = moment().add(10000, 'milliseconds').toDate()
      job.save()
    }
  }
})

const downloadCV = async (job) => {
  const { email, password, id } = job.attrs.data

  const result = await download(email, password)

  if (result) {
    return await parsePDF(result, id)
  } else {
    return null
  }
}

module.exports = { jobQueue }
