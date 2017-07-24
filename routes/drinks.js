const ERROR_MESSAGE = 'Opss, something went wrong!'

const ADD_DRINK = 'INSERT INTO drinks (code, name) VALUES (?, ?)'
const FIND_BY_ID = 'SELECT code, name FROM drinks WHERE id = ?'
const FIND_BY_CODE = 'SELECT code, name FROM drinks WHERE code = ?'
const GET_DRINKS = 'SELECT code, name FROM drinks'

const GET_COUNT = `SELECT d.name AS drink, COUNT(g.drink_code) AS ammount
                          FROM guests AS g, drinks AS d  WHERE
                          g.drink_code = d.code GROUP BY drink_code ORDER BY ammount DESC`

module.exports = (app, connection, cors, corsOptions) => {
  // POST - Create new drink
  const add = (req, res) => {
    const queryParams = [ req.body.code, req.body.name ]

    connection.query(ADD_DRINK, queryParams, (err, response) => {
      console.info('CREATE NEW DRINK', new Date().toLocaleString())
      if (!err) {
        const req = {
          params: {
            id: response.insertId
          }
        }

        return findById(req, res)
      }

      _sendError(res)
    })
  }

  // GET - Get all drinks
  const get = (req, res) => {
    connection.query(GET_DRINKS, (err, drinks) => {
      console.info('GET ALL DRINKS', new Date().toLocaleString())
      if (!err) {
        if (!drinks.length) {
          return res.send({})
        }

        return res.send(drinks)
      }

      _sendError(res)
    })
  }

  // GET - Get count
  const getCount = (req, res) => {
    connection.query(GET_COUNT, (err, result) => {
      console.info('GET DRINKS COUNT', new Date().toLocaleString())
      if (!err) {
        if (!result.length) {
          return res.send([])
        }
        return res.send(result)
      }
      _sendError(res)
    })
  }

  // GET - Return a drink with specified ID
  const findById = (req, res) => {
    _getOne(req.params.id, res, FIND_BY_ID)
  }

  // GET - Return a drink with specified CODE
  const findByCode = (req, res) => {
    _getOne(req.params.code, res, FIND_BY_CODE)
  }

  const _getOne = (params, res, query) => {
    connection.query(query, params, (err, drinks) => {
      console.info('GET ONE DRINK', new Date().toLocaleString())
      if (!err) {
        if (!drinks.length) {
          return res.send([])
        }

        return res.send(drinks[0])
      }

      _sendError(res)
    })
  }

  const _sendError = (res) => {
    res.statusCode = 500
    res.send({ message: ERROR_MESSAGE })
  }

  app.post('/drink', cors(corsOptions), add)
  app.get('/drink/:code', cors(corsOptions), findByCode)
  app.get('/drinks', cors(corsOptions), get)
  app.get('/drinks/count', cors(corsOptions), getCount)
}
