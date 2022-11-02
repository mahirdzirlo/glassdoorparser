const { api_key } = require('../config/middleware.config')

const resumeAuth = async (req, res, next) => {
  let apikeyHeader = req.get('apiKey')
  if (apikeyHeader !== api_key) {
    res.statusCode = 401
    res.end()
  } else {
    next()
  }
}

module.exports = {
  resumeAuth,
}
