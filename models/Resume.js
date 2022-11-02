const mongoose = require('mongoose')
const Schema = mongoose.Schema

const resumeSchema = new Schema({
  resumeID: { type: String, unique: true },
  firstname: String,
  lastname: String,
  email: String,
  profession: String,
  about: String,
  experiences: [{ position: String, company: String, location: String, period: String, description: String }],
  skills: [String],
  certs: [{ name: String, company: String, period: String, description: String }],
  education: [{ name: String, degree: String, location: String, period: String, description: String }],
  fileUrl: String,
})

module.exports = mongoose.model('Resume', resumeSchema, 'resumes')
