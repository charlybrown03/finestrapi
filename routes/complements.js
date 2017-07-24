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
          res.send([])
          return
        }
        res.send(complements)
      } else {
        res.statusCode = 500
        res.send({ message: 'Opss, something went wrong!' })
      }
    })
  }

  // GET - Get count
  const getCount = (req, res) => {
    connection.query(GET_COUNT, (err, result) => {
      console.info('GET COMPLEMENTS COUNT', new Date().toLocaleString())
      if (!err) {
        if (!result.length) {
          return res.send([])
        }
        return res.send(result)
      }
      _sendError(res)
    })
  }

  app.get('/complements', cors(corsOptions), get)
  app.get('/complements/count', cors(corsOptions), getCount)
}
