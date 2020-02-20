const rp = require('request-promise')
const retries = process.env.RETRIES || 3
const delay = process.env.RETRY_DELAY || 1000
const timeout = process.env.TIMEOUT || 1000

const requestRetry = (options, retries) => {
  return new Promise((resolve, reject) => {
    const retry = (options, n) => {
      return rp(options)
        .then(response => {
          if (response.body.error || response.body['Error Message']) {
            if (n === 1) {
              reject(response)
            } else {
              setTimeout(() => {
                retries--
                retry(options, retries)
              }, delay)
            }
          } else {
            return resolve(response)
          }
        })
        .catch(error => {
          if (n === 1) {
            reject(error)
          } else {
            setTimeout(() => {
              retries--
              retry(options, retries)
            }, delay)
          }
        })
    }
    return retry(options, retries)
  })
}

const createRequest = (input, callback) => {
  const url = 'https://www.alphavantage.co/query'
  const func = input.data.function || 'CURRENCY_EXCHANGE_RATE'
  const from = input.data.from || ''
  const to = input.data.to || ''

  let queryObj = {
    function: func,
    from_currency: from,
    to_currency: to,
    from_symbol: from,
    to_symbol: to,
    symbol: from,
    market: to,
    apikey: process.env.API_KEY
  }

  for (let key in queryObj) {
    if (queryObj[key] === '') {
      delete queryObj[key]
    }
  }

  const options = {
    url: url,
    qs: queryObj,
    json: true,
    timeout,
    resolveWithFullResponse: true
  }
  requestRetry(options, retries)
    .then(response => {
      const result = JSON.parse(response.body['Realtime Currency Exchange Rate']['5. Exchange Rate'])
      response.body.result = result
      callback(response.statusCode, {
        jobRunID: input.id,
        data: response.body,
        result,
        statusCode: response.statusCode
      })
    })
    .catch(error => {
      callback(error.statusCode, {
        jobRunID: input.id,
        status: 'errored',
        error,
        statusCode: error.statusCode
      })
    })
}

exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data)
  })
}

exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

module.exports.createRequest = createRequest
