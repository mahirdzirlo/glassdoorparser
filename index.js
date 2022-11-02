const express = require('express')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./docs/openapi.json')

const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`)
  console.log(`request body:${JSON.stringify(req.body)}`)
  next()
}

const app = express()
const port = 8080

app.use(express.json())
app.use(logRequestStart)

require('./routes/job.routes')(app)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(function (err, res) {
  console.log('app error', err.stack)
  res.sendStatus(500)
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

module.exports = app
