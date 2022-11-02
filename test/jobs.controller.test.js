const chai = require('chai')
const sinon = require('sinon')
const controller = require('../controllers/jobs.controller')
const expect = chai.expect

describe('Jobs controller', function () {
  this.timeout(25000)
  describe('Process CV', function () {
    it('should not check when parameter  is not provided', async function () {
      let spy = sinon.spy(console, 'log')
      let req = { body: { email: '' } }
      const res = { status: sinon.stub().returnsThis(), send: sinon.stub() }
      await controller.processCV(req, res)
      expect(res.status.calledWith(400)).to.be.ok
      expect(spy.calledWith('missing params')).to.be.ok
    })
  })
})
