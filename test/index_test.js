const assert = require('chai').assert
const createRequest = require('../index.js').createRequest

describe('createRequest', () => {
  const jobID = '278c97ffadb54a5bbb93cfec5f7b5503'

  context('when specifying a coin and market', () => {
    const req = {
      id: jobID,
      data: {
        from: 'XAU',
        to: 'USD'
      }
    }

    it('returns data to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.data)
        assert.isNumber(data.result)
        done()
      })
    })
  })

  context('when using default parameters', () => {
    const req = {
      id: jobID,
      data: {}
    }

    it('returns an error to the node', (done) => {
      createRequest(req, (statusCode, data) => {
        assert.equal(statusCode, 200)
        assert.equal(data.jobRunID, jobID)
        assert.isNotEmpty(data.error)
        done()
      })
    })
  })
})
