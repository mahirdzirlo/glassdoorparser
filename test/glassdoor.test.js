const chai = require('chai')
const service = require('../services/glassdoor')
const expect = chai.expect

describe('Jobs controller', function () {
  describe('glassdoor functions', function (downloadProgress) {
    it('should  OK login params', async function () {
      const result = await service.login('email', 'pass')
      expect(result).to.equal(true)
    }).timeout(25000)

    it('should return not OK for wrong login', async function () {
      const result = await service.login('email', 'pass')
      expect(result).to.equal(false)
    }).timeout(25000)
  })
})
