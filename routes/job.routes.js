const controller = require('../controllers/jobs.controller')
const { resumeAuth } = require('../middleware/auth')

module.exports = function (app) {
  app.post('/api/cv', resumeAuth, controller.processCV)
  app.get('/api/job/:id', controller.checkCV)
  app.get('/api/cv/:id', controller.getCV)
}
