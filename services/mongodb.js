const Resume = require('../models/Resume')

const saveCV = async (data) => {
  const newResume = new Resume({
    resumeID: data.id,
    firstname: data.profile.name.split(' ')[0],
    lastname: data.profile.name.split(' ')[1],
    email: data.profile.email,
    profession: data.profile.profession,
    about: data.profile.about,
    experiences: data.profile.experiences,
    skills: data.profile.skills,
    certs: data.profile.certs,
    education: data.profile.education,
    fileUrl: `http://localhost:8080/api/cv/${data.id}`,
  })
  try {
    const doc = await newResume.save()
    return 1
  } catch (err) {
    console.log('add resume error', err)
    return null
  }
}

const getCVdata = async (id) => {
  const cv = await Resume.find({ resumeID: id })
  if (cv) {
    return cv
  } else {
    return 0
  }
}

module.exports = { saveCV, getCVdata }
