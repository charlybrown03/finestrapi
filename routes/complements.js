const ERROR_MESSAGE = 'Opss, something went wrong!'

const GET_ALL = 'SELECT * FROM complements'
const GET_COUNT = `SELECT c.name AS complement, COUNT(g.complement_code) AS ammount
                              FROM guests AS g, complements AS c  WHERE g.complement_code = c.code
                              GROUP BY complement_code ORDER BY ammount DESC;`

module.exports = (app, connection, cors, corsOptions) => {
  // GET - Get all complements
  const get = (req, res) => {
    connection.query(GET_ALL, (err, complements) => {
      console.info('GET ALL COMPLEMENTS', new Date().toLocaleString())
      if (!err) {
        if (!complements.length) {
          _sendResponse(res, [])
          return
        }
        _sendResponse(res, complements)
      } else {
        res.statusCode = 500
        _sendResponse(res, { message: 'Opss, something went wrong!' })
      }
    })
  }

  // GET - Get count
  const getCount = (req, res) => {
    connection.query(GET_COUNT, (err, result) => {
      console.info('GET COMPLEMENTS COUNT', new Date().toLocaleString())
      if (!err) {
        if (!result.length) {
          return _sendResponse(res, [])
        }
        return _sendResponse(res, result)
      }
      _sendError(res)
    })
  }

  const _sendResponse = (res, content) => {
    res.setHeader('Cache-Control', 'max-age=2592000')
    res.send(content)
  }

  const _sendError = (res) => {
    res.statusCode = 500
    _sendResponse(res, { message: ERROR_MESSAGE })
  }

  app.get('/complements', cors(corsOptions), get)
  app.get('/complements/count', cors(corsOptions), getCount)
}
