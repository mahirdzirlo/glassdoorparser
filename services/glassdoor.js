const puppeteer = require('puppeteer')
const fs = require('fs')
const https = require('https')
const path = require('path')

const login = async (user, pass) => {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto('https://glassdoor.com')
    await page.$eval('#SiteNav > nav > div.d-none.d-md-block.LockedHomeHeaderStyles__bottomBorder > div > div > div > button', (elem) => elem.click())
    await page.type('#modalUserEmail', user)
    await page.type('#modalUserPassword', pass)
    await page.$eval(
      '#LoginModal > div > div > div.modal_main.actionBarMt0 > div.fullContent > div.modal_content > div > div > form > div.d-flex.align-items-center.flex-column > button',
      (elem) => elem.click()
    )
    await page.waitFor(4000)
    const exists = await page.$eval('#UserAlert', () => true).catch(() => false)
    await browser.close()
    return exists
  } catch (error) {
    console.log(error)
    return null
  }
}

const download = async (user, pass) => {
  try {
    const downloadPath = path.resolve('./downloads')
    let fileName
    let result = {}
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page._client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      userDataDir: './',
      downloadPath: downloadPath, // Change this to your desired download path.
    })

    await page.goto('https://glassdoor.com')
    await page.$eval('#SiteNav > nav > div.d-none.d-md-block.LockedHomeHeaderStyles__bottomBorder > div > div > div > button', (elem) => elem.click())
    await page.type('#modalUserEmail', user)
    await page.type('#modalUserPassword', pass)
    await page.$eval(
      '#LoginModal > div > div > div.modal_main.actionBarMt0 > div.fullContent > div.modal_content > div > div > form > div.d-flex.align-items-center.flex-column > button',
      (elem) => elem.click()
    )
    await page.waitForNavigation()

    await page.goto('https://www.glassdoor.com/member/profile/index.htm', {
      waitUntil: 'networkidle0',
    })

    let objprofile = await page.evaluate(function () {
      let name = document.querySelector('section#ProfileInfo h3').textContent.trim()
      let profession = document
        .querySelector(
          'section#ProfileInfo div.row.mb-lg.profileInfoStyle__profileInfoMain___Y8O5Z.profileInfoStyle__visible___1bdIC > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)'
        )
        .textContent.trim()
      let email = document
        .querySelector(
          'section#ProfileInfo div:nth-child(2) > div.no-gutters.mb-md-xxsm.d-flex.justify-content-start.align-items-start.profileInfoStyle__entryItem___1hOfs > div:nth-child(2)'
        )
        .textContent.trim()
      let experiences = []
      let experiencesUL = document.querySelectorAll('#Experience > div > ul > li')
      experiencesUL.forEach((item) => {
        let itemArray = item.innerText.split('\n')

        experiences.push({
          position: itemArray[0],
          company: itemArray[1],
          location: itemArray[2],
          period: itemArray[3],
          description: itemArray.slice(4).join(''),
        })
      })
      let skills = []
      let skillsList = document.querySelectorAll('#Skills > div > div.skillsStyle__capitalize___1tkT7.skillsStyle__skillList___3qVgi > div > span')

      skillsList.forEach((item) => {
        if (item.title !== '') {
          skills.push(item.title)
        }
      })

      let about = document.querySelector('section#AboutMe > p').textContent.trim()

      let education = []
      let educationUL = document.querySelectorAll('#Education > div > ul > li')
      educationUL.forEach((item) => {
        let itemArray = item.innerText.split('\n')

        education.push({
          name: itemArray[0],
          degree: itemArray[1],
          location: itemArray[2],
          period: itemArray[3],
          description: itemArray.slice(4).join(''),
        })
      })

      let certs = []
      let certsUL = document.querySelectorAll('#Certification > div > ul > li')
      certsUL.forEach((item) => {
        let itemArray = item.innerText.split('\n')

        certs.push({
          name: itemArray[0],
          company: itemArray[1],
          period: itemArray[2],
          description: itemArray.slice(3).join(''),
        })
      })
      var obj = {
        name,
        email,
        profession,
        about,
        experiences,
        skills,
        education,
        certs,
      }
      return obj
    })
    result.profile = objprofile
    await page.goto('https://www.glassdoor.com/member/profile/resumes.htm', {
      waitUntil: 'networkidle0',
    })

    await page._client.on('Page.downloadWillBegin', ({ url, suggestedFilename }) => {
      console.log('download beginning,', url, suggestedFilename)
      fileName = suggestedFilename
      result.filename = fileName
    })

    await page._client.on('Page.downloadProgress', async ({ state }) => {
      if (state === 'completed') {
        console.log('download completed. File location: ', downloadPath + '/' + fileName)
      }
    })
    await page.$eval('#Container a', (elem) => {
      elem.click()
    })
    await page.waitFor(6000)
    await browser.close()
    return result
  } catch (error) {
    console.log(error)
    return null
  }
}

module.exports = { login, download }
